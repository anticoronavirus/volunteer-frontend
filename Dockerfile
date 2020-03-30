FROM node as BUILDER
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --ignore-engines --production
COPY . ./
RUN yarn build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
WORKDIR /usr/share/nginx/html
COPY --from=BUILDER /usr/src/app/build/ /usr/share/nginx/html