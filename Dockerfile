FROM node:lts

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN CI=true

RUN npm set unsafe-perm true
RUN npm install
ENV PATH /usr/src/app/node_modules/.bin:${PATH}

EXPOSE ${PORT}

CMD ["npm", "start"]