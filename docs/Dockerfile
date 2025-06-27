FROM node:20-alpine

WORKDIR /app

# Copy the docs directory
COPY . .

# Install mintlify
RUN npm install -g mintlify

# Expose the default Mintlify port
EXPOSE 3000

# Run Mintlify dev server
CMD ["mintlify", "dev", "--host", "0.0.0.0"] 