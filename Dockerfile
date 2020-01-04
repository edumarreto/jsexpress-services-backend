FROM node:latest

# Create app directory on local - tbd copy from git
RUN mkdir -p /jsexpress-services-backend
WORKDIR /jsexpress-services-backend

# Install app dependencies
COPY package.json /jsexpress-services-backend
RUN npm install

# Bundle app source
COPY . /jsexpress-services-backend

EXPOSE 3000
CMD [ "npm", "start" ]
