FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Default command to compile and deploy contracts
CMD ["sh", "-c", "npx truffle compile && npx truffle migrate --network docker --reset"]
