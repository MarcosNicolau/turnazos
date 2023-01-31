# stage 1 building the code
FROM node:16-alpine AS builder

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

# stage 2
FROM node:16-alpine AS bundler

USER node

WORKDIR /home/node/app

# Copy the complide ts code
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# We need the src folder for ts-node-paths module
COPY --from=builder --chown=node:node /app/src ./src 
COPY --from=builder --chown=node:node /app/tsconfig.json ./tsconfig.json 
COPY --from=builder --chown=node:node /app/package.json ./package.json 

# Bundle app source
ARG PORT=8080
ENV PORT=${PORT}

EXPOSE ${PORT}
CMD npm start