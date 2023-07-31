FROM node:20-alpine
WORKDIR /usr/src/app
RUN mkdir ./data
EXPOSE 3000
COPY ./build /usr/src/app
RUN npm install --omit=dev
CMD node /usr/src/app/index.js
