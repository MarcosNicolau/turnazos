ARG LOGS_DIR_NAME="/var/log/turnazos_logger/"

# stage 1 building the code
FROM node:19-alpine3.16 AS builder
ARG LOGS_DIR_NAME

USER root

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./package*.json ./
COPY ./yarn.lock ./

# Install app dependencies
RUN npm install

# Copy used packages
COPY ./ ./

# Build packages
RUN npm run build

# Remove dev depedencies
RUN npm prune --production

# Create the logs directory here so later, in stage 2, we can chown it.
RUN mkdir ${LOGS_DIR_NAME}

# stage 2 bundling code
FROM node:19-alpine AS bundler
ARG LOGS_DIR_NAME

USER node
WORKDIR /home/node/app

# Copy the complide ts code
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# We need the src folder for ts-node-paths module
COPY --from=builder --chown=node:node /app/src ./src 
COPY --from=builder --chown=node:node /app/tsconfig.json ./tsconfig.json 
COPY --from=builder --chown=node:node /app/package.json ./package.json 

# Finally, copy the logs directory and chown it to the node user so the logger can write to it
COPY --from=builder --chown=node:node ${LOGS_DIR_NAME} ${LOGS_DIR_NAME}


# Bundle app source
ARG PORT=8081
ENV PORT=${PORT}
ENV LOGS_DIR_NAME=${LOGS_DIR_NAME}

EXPOSE ${PORT}
CMD npm start