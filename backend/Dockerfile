# Usando Node.js 18 como base
FROM node:18

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json para instalar dependências primeiro
COPY package*.json ./

# Instalar dependências e o nodemon globalmente
RUN npm install && npm install -g nodemon

# Copiar todos os arquivos do projeto
COPY . .

# Expor a porta da aplicação
EXPOSE 4000

# Comando para iniciar a aplicação com nodemon
CMD ["nodemon", "index.js"]
