#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Deploy a local apptest frontend dist directory through the jump server.

Usage:
  scripts/deploy_apptest_dist.sh <dist-dir>

Defaults:
  JUMP_HOST=ceco@192.168.188.10
  TARGET_HOST=xk
  TARGET_DIR=/home/app/services/apptest/dist
  REMOTE_BASE=/home/ceco/apptest-deploys

Examples:
  scripts/deploy_apptest_dist.sh ./dist
  scripts/deploy_apptest_dist.sh /path/to/dist

Optional environment overrides:
  JUMP_HOST=ceco@192.168.188.10 TARGET_HOST=xk TARGET_DIR=/home/app/services/apptest/dist scripts/deploy_apptest_dist.sh ./dist
  KEEP_REMOTE_WORK=1 scripts/deploy_apptest_dist.sh ./dist

Zip files are also accepted when a one-off package needs to be deployed.
USAGE
}

die() {
  echo "ERROR: $*" >&2
  exit 1
}

quote() {
  printf "%q" "$1"
}

SRC="${1:-}"
if [ -z "${SRC}" ]; then
  usage >&2
  exit 2
fi

JUMP_HOST="${JUMP_HOST:-ceco@192.168.188.10}"
TARGET_HOST="${TARGET_HOST:-xk}"
TARGET_DIR="${TARGET_DIR:-/home/app/services/apptest/dist}"
REMOTE_BASE="${REMOTE_BASE:-/home/ceco/apptest-deploys}"
KEEP_REMOTE_WORK="${KEEP_REMOTE_WORK:-0}"

command -v ssh >/dev/null || die "ssh is required"
command -v scp >/dev/null || die "scp is required"
command -v tar >/dev/null || die "tar is required"

LOCAL_TMP="$(mktemp -d "${TMPDIR:-/tmp}/apptest-dist.XXXXXX")"
CONTROL_PATH="${LOCAL_TMP}/ssh-%r@%h:%p"
SSH_OPTS=(
  -o StrictHostKeyChecking=accept-new
  -o ControlMaster=auto
  -o ControlPersist=10m
  -o ControlPath="${CONTROL_PATH}"
)

cleanup() {
  ssh "${SSH_OPTS[@]}" -O exit "${JUMP_HOST}" >/dev/null 2>&1 || true
  rm -rf "${LOCAL_TMP}"
}
trap cleanup EXIT

resolve_content_dir() {
  local root="$1"
  local candidate_count
  local candidate_file

  if [ -f "${root}/index.html" ]; then
    printf "%s\n" "${root}"
    return 0
  fi

  if [ -f "${root}/dist/index.html" ]; then
    printf "%s\n" "${root}/dist"
    return 0
  fi

  candidate_count="$(find "${root}" -mindepth 2 -maxdepth 3 -type f -name index.html | wc -l | tr -d ' ')"
  if [ "${candidate_count}" = "1" ]; then
    candidate_file="$(find "${root}" -mindepth 2 -maxdepth 3 -type f -name index.html | sort | sed -n '1p')"
    dirname "${candidate_file}"
    return 0
  fi

  return 1
}

EXTRACT_ROOT="${LOCAL_TMP}/extract"
mkdir -p "${EXTRACT_ROOT}"

if [ -d "${SRC}" ]; then
  CONTENT_DIR="$(resolve_content_dir "${SRC}")" || die "could not find index.html in ${SRC} or ${SRC}/dist"
elif [ -f "${SRC}" ]; then
  command -v unzip >/dev/null || die "unzip is required for zip packages"

  echo "Checking zip package"
  unzip -tqq "${SRC}"
  if unzip -Z -1 "${SRC}" | awk '$0 ~ /^\/|(^|\/)\.\.($|\/)/ { bad=1 } END { exit bad }'; then
    :
  else
    die "zip contains unsafe absolute or parent-directory paths"
  fi

  unzip -q "${SRC}" -d "${EXTRACT_ROOT}"
  CONTENT_DIR="$(resolve_content_dir "${EXTRACT_ROOT}")" || die "could not find index.html in extracted package"
else
  die "source not found: ${SRC}"
fi

test -f "${CONTENT_DIR}/index.html" || die "index.html not found in ${CONTENT_DIR}"

ARCHIVE="${LOCAL_TMP}/dist.tar.gz"
echo "Packaging dist content from ${CONTENT_DIR}"
COPYFILE_DISABLE=1 tar -C "${CONTENT_DIR}" -czf "${ARCHIVE}" .
tar -tzf "${ARCHIVE}" | grep -Eq '^(\./)?index\.html$' || die "archive does not contain index.html at dist root"

DEPLOY_ID="$(date +%Y%m%d%H%M%S)"
REMOTE_WORK="${REMOTE_BASE}/apptest-dist-${DEPLOY_ID}"

echo "Preparing jump server work dir: ${JUMP_HOST}:${REMOTE_WORK}"
ssh "${SSH_OPTS[@]}" "${JUMP_HOST}" "mkdir -p $(quote "${REMOTE_WORK}")"

echo "Uploading package to jump server"
scp "${SSH_OPTS[@]}" "${ARCHIVE}" "${JUMP_HOST}:${REMOTE_WORK}/dist.tar.gz"

echo "Deploying to ${TARGET_HOST}:${TARGET_DIR}"
ssh "${SSH_OPTS[@]}" "${JUMP_HOST}" \
  "TARGET_HOST=$(quote "${TARGET_HOST}") TARGET_DIR=$(quote "${TARGET_DIR}") REMOTE_WORK=$(quote "${REMOTE_WORK}") KEEP_REMOTE_WORK=$(quote "${KEEP_REMOTE_WORK}") bash -s" <<'REMOTE_SCRIPT'
set -euo pipefail

archive="${REMOTE_WORK}/dist.tar.gz"
test -s "${archive}"

target_q="$(printf "%q" "${TARGET_DIR}")"

echo "Backing up current dist"
ssh "${TARGET_HOST}" "set -eu
target=${target_q}
parent=\$(dirname \"\$target\")
base=\$(basename \"\$target\")
mkdir -p \"\$parent\"
if [ -d \"\$target\" ]; then
  cd \"\$parent\"
  cp -a \"\$base\" \"\${base}_backup_\$(date +%Y%m%d%H%M%S)\"
else
  mkdir -p \"\$target\"
fi"

echo "Clearing current dist"
ssh "${TARGET_HOST}" "set -eu
target=${target_q}
mkdir -p \"\$target\"
find \"\$target\" -mindepth 1 -maxdepth 1 -exec rm -rf {} +"

echo "Publishing new dist"
cat "${archive}" | ssh "${TARGET_HOST}" "set -eu
target=${target_q}
mkdir -p \"\$target\"
tar -xzf - -C \"\$target\""

echo "Verifying published files"
ssh "${TARGET_HOST}" "set -eu
target=${target_q}
test -d \"\$target\"
test -f \"\$target/index.html\"
echo \"published: \$target\"
find \"\$target\" -maxdepth 2 -mindepth 1 | sed -n '1,40p'
echo \"file_count=\$(find \"\$target\" -type f | wc -l)\""

if [ "${KEEP_REMOTE_WORK}" != "1" ]; then
  rm -rf "${REMOTE_WORK}"
else
  echo "kept remote work dir: ${REMOTE_WORK}"
fi
REMOTE_SCRIPT

echo "Deploy complete"
