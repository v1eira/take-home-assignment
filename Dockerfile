FROM node:20.14.0-alpine3.20 as base

WORKDIR /usr/src/app

COPY package*.json ./
    
RUN npm install

COPY . .


FROM base as builder

WORKDIR /usr/src/app

RUN npm run build


FROM node:20.14.0-alpine3.20 as runner
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start:prod"]