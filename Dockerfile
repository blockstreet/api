# Minimal Node.js Docker Images built on Alpine Linux
FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Create directory to work in
RUN mkdir /src

# Copy application into container
ADD ./ /src/api

COPY package.json /src/api
COPY package-lock.json /src/api

# Set directory to execute commands in
WORKDIR /src/api

RUN npm -v

RUN ls -la

# Install dependencies
RUN npm install --loglevel=warn

# Expose the port we are running on
EXPOSE 3000

CMD export NODE_ENV=production

# Execute the application
CMD ["npm", "start"]