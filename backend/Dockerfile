# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of code
COPY . .

# Copy package.json first
COPY package*.json ./

# Install all dependencies including dev for TS types
RUN npm install
RUN npm install --save-dev @types/bcrypt @types/nodemailer

# Build TypeScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
