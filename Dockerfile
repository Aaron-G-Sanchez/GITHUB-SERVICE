FROM oven/bun:alpine

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 8080

CMD [ "bun", "run", "start" ]