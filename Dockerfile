ARG DATA_DIR_NAME=/data/storage
# stage 1 building the code
FROM node:19-alpine3.16 AS builder
ARG DATA_DIR_NAME

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

# Remove devDepedencies
RUN npm prune --production

# Create the storage directories here so later, in stage 2, we can chown it.
RUN mkdir -p ${DATA_DIR_NAME}
RUN mkdir ${DATA_DIR_NAME}/public
RUN mkdir ${DATA_DIR_NAME}/private


# stage 2
FROM node:19-alpine3.16 AS bundler
ARG DATA_DIR_NAME

USER node

WORKDIR /home/node/app

# Copy the complide ts code
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# We need the src folder for ts-node-paths module
COPY --from=builder --chown=node:node /app/src ./src 
COPY --from=builder --chown=node:node /app/tsconfig.json ./tsconfig.json 
COPY --from=builder --chown=node:node /app/package.json ./package.json 

# Finally, copy the data directory and chown it to the node user so the logger can write to it
COPY --from=builder --chown=node:node ${DATA_DIR_NAME} ${DATA_DIR_NAME}

# Bundle app source
ARG PORT=8000
ENV PORT=${PORT}
ENV FILES_BASE_DIR_PUBLIC=${DATA_DIR_NAME}/public
ENV FILES_BASE_DIR_PRIVATE=${DATA_DIR_NAME}/private

EXPOSE ${PORT}
CMD npm start