#!/usr/bin/env bash
set -euo pipefail

if [ "${ADMIN_DIST_ASKPASS:-}" = "1" ]; then
  printf '%s\n' "${SSH_PASSWORD:-}"
  exit 0
fi

SSH_USER="${SSH_USER:-root}"
SSH_HOST="${SSH_HOST:-124.220.46.162}"
SSH_PORT="${SSH_PORT:-22}"
SSH_PASSWORD_DEFAULT='zam.123456'
SSH_PASSWORD="${SSH_PASSWORD:-${SSH_PASSWORD_DEFAULT}}"
REMOTE_DIR="${REMOTE_DIR:-/opt/school-app}"
REMOTE_DIST_DIR="${REMOTE_DIST_DIR:-${REMOTE_DIR}/shared/dist}"
SCHOOL_HTTP_PORT="${SCHOOL_HTTP_PORT:-8085}"

if [ -n "${SSH_PASSWORD}" ]; then
  export SSH_PASSWORD
  export ADMIN_DIST_ASKPASS=1
  export SSH_ASKPASS="$(realpath "${BASH_SOURCE[0]}")"
  export SSH_ASKPASS_REQUIRE=force
  export DISPLAY="${DISPLAY:-:0}"
fi

LOCAL_DIST="${1:-${DIST_DIR:-dist}}"
TS="$(date +%Y%m%d%H%M%S)"
ARCHIVE="/tmp/admin-dist-${TS}.tar.gz"
REMOTE_TMP_DIR="${REMOTE_DIR}/tmp/admin-dist-${TS}"
REMOTE_BACKUP_DIR="${REMOTE_DIR}/shared/dist_backups"

cleanup() {
  rm -f "${ARCHIVE}"
}
trap cleanup EXIT

if [ ! -d "${LOCAL_DIST}" ]; then
  echo "Local dist directory not found: ${LOCAL_DIST}" >&2
  exit 1
fi

if [ ! -f "${LOCAL_DIST}/index.html" ]; then
  echo "Expected ${LOCAL_DIST}/index.html, but it was not found." >&2
  echo "Pass the built admin dist directory as the first argument." >&2
  exit 1
fi

echo "Packaging admin dist from ${LOCAL_DIST}"
COPYFILE_DISABLE=1 tar -C "${LOCAL_DIST}" -czf "${ARCHIVE}" .

echo "Preparing remote dist directory on ${SSH_HOST}"
ssh -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" \
  "mkdir -p '${REMOTE_TMP_DIR}' '${REMOTE_DIST_DIR}' '${REMOTE_BACKUP_DIR}'"

echo "Uploading admin dist archive"
scp -P "${SSH_PORT}" "${ARCHIVE}" "${SSH_USER}@${SSH_HOST}:${REMOTE_TMP_DIR}/admin-dist.tar.gz"

echo "Publishing admin dist to ${REMOTE_DIST_DIR}"
ssh -p "${SSH_PORT}" "${SSH_USER}@${SSH_HOST}" \
  "set -euo pipefail
   if [ -d '${REMOTE_DIST_DIR}' ] && find '${REMOTE_DIST_DIR}' -mindepth 1 -maxdepth 1 | grep -q .; then
     tar -C '${REMOTE_DIST_DIR}' -czf '${REMOTE_BACKUP_DIR}/admin-dist-${TS}.tar.gz' .
   fi
   find '${REMOTE_DIST_DIR}' -mindepth 1 -maxdepth 1 -exec rm -rf {} +
   tar -C '${REMOTE_DIST_DIR}' -xzf '${REMOTE_TMP_DIR}/admin-dist.tar.gz'
   rm -rf '${REMOTE_TMP_DIR}'
   find '${REMOTE_DIST_DIR}' -maxdepth 2 -type f | sed -n '1,20p'"

echo "Admin dist uploaded to http://${SSH_HOST}:${SCHOOL_HTTP_PORT}/"
