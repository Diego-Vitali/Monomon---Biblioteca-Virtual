# monomon

sistema para gerenciar acervo e empréstimo de livros

o repositório é dividido em duas partes:
- api: backend feito em java (spring boot) usando banco em memória h2 e proteção com jwt
- monomon: aplicativo mobile feito em react native (expo)

rodar localmente

a forma mais fácil de subir o ambiente é usando o docker
basta ter o docker e o docker-compose instalados

na raiz do projeto execute:
`docker-compose up --build`

isso vai subir a api na porta 8080 e o servidor do expo na 8081

detalhe: se for executar o aplicativo num celular físico para testar, lembre de trocar a url da api para apontar para o ip local do computador
tem um arquivo de exemplo `.env.example` na pasta do monomon mostrando como configurar isso
