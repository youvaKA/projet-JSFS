FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

RUN npm i

# Bundle app source
COPY . .

EXPOSE 3001
CMD ["mongod --dbpath server/config" ,"nodemon"]