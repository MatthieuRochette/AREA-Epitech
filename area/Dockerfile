FROM node:15-alpine as build

WORKDIR /app
COPY . /app

RUN npm install --silent
RUN npm run build


# --------------------------- #
FROM nginx

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]