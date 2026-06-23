FROM node:20-alpine

WORKDIR /app

# Copia as definições do pacote e instala
COPY package.json package-lock.json ./
RUN npm install

# Copia o resto do projeto
COPY . .

# Expõe a porta padrão do Expo (Metro Bundler)
EXPOSE 8081

# Comando para iniciar o Expo
CMD ["npx", "expo", "start"]
