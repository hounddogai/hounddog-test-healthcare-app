FROM node:21-bookworm

WORKDIR /server

# Copy app source and install dependencies
COPY . .
RUN npm install --no-fund --no-audit

# Expose port 5174
EXPOSE 5174

# Start Express server
CMD npm run start -- --host
