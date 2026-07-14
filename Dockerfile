# 第一阶段：安装依赖和构建应用
FROM node:18-alpine3.18

WORKDIR /tksz

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

WORKDIR /tksz/tkszWeb

## 打包构建
ENTRYPOINT ["npm","run","build:pro"]
