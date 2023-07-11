FROM node:20-alpine
WORKDIR /usr/src/app
COPY ./build /usr/src/app
RUN npm install --omit=dev
RUN mkdir ./data
EXPOSE 3000
CMD node /usr/src/app/index.js
