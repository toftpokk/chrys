FROM node:20-alpine
WORKDIR /usr/src/app
COPY ./build /usr/src/app
EXPOSE 3000
CMD npm run dev
