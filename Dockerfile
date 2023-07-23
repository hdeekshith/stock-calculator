FROM node:16.17.0-alpine AS build

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies (including dev dependencies for building)
RUN npm i

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the production image
FROM node:16.17.0-alpine

ENV NODE_ENV=prod
# Create app directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist

# Install only production dependencies
RUN npm i --production

# Expose the port
EXPOSE 3000

# Start the server as production
CMD [ "npm", "run", "start:prod" ]