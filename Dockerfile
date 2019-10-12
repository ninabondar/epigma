FROM alpine
RUN mkdir -p /usr/src/epigma
WORKDIR /usr/src/epigma
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["yarn","start"]
