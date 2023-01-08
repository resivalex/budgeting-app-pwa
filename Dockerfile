FROM node:14-alpine3.12

WORKDIR /app

RUN yarn add serve

ADD build build

#ADD ["package.json", "package-lock.json", "./"]
#
#RUN yarn install
#
#ADD public public
#ADD src src
#ADD [".env", "tsconfig.json", "./"]
#
#RUN yarn build

CMD ["yarn", "run", "serve", "--single", "build", "--listen", "tcp://0.0.0.0:3000"]
