FROM node:20 as builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./src ./src

COPY ./package.json ./package.json

COPY ./pnpm-lock.yaml ./pnpm-lock.yaml

COPY ./tsconfig*.json ./tsconfig.json

COPY ./nest-cli.json ./nest-cli.json

RUN pnpm i

RUN pnpm run build

FROM node:20-alpine as production

WORKDIR /app

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm i --prod

CMD [ "node", "./dist/main.js" ]
