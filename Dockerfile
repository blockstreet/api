# Minimal Node.js Docker Images built on Alpine Linux
FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Create directory to work in
RUN mkdir /src

# Copy application into container
ADD ./ /src/api

# Set directory to execute commands in
WORKDIR /src/api

# Install dependencies
RUN npm install --loglevel=warn

# Expose the port we are running on
EXPOSE 4000

# Execute the application
ENTRYPOINT ["npm", "run", "start"]
