FROM node:24
ENV HUSKY=0
WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm install -g pnpm

RUN pnpm install --ignore-scripts && pnpm rebuild

COPY . .

EXPOSE 5000

CMD ["pnpm", "dev"]