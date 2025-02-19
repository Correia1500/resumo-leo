FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia o restante do código do frontend
COPY . .

# Expõe a porta (exemplo 3000 para React)
EXPOSE 3000

# Comando para iniciar o React
CMD ["npm", "start"]
