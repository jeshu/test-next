FROM node:14

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install
RUN npm i
RUN npm i tsc
COPY . .

RUN npm run dev


CMD [ "yarn", "start" ]

EXPOSE 3000
EXPOSE 3625