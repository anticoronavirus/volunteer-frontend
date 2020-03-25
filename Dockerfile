FROM node as BUILDER
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . ./
RUN yarn build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=BUILDER /usr/src/app/build/ /usr/share/nginx/html