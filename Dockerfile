# Base image
FROM node:20.15.0 as base

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install --omit=dev

# Execute test cases and stop build if fails
# RUN npm run test || exit 1

# Generate Prisma Schemas
RUN npm run prisma:generate

# Push DB Schema to DB
RUN npx prisma db push

# Run Seeder
RUN npx prisma db seed


# Creates a "dist" folder with the production build
RUN npm run build

# Prod-Ready Image
FROM node:20.15.0 as prod
RUN mkdir dist node_modules

ENV TZ="Asia/Kolkata"
RUN date

COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package*.json ./

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]