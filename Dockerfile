FROM node:21-bookworm

WORKDIR /app

# Copy app source and install dependencies
COPY . .
RUN npm install --no-fund --no-audit

# Expose port 5173.
EXPOSE 5173

# Start Remix dev server
CMD npm run dev -- --host
