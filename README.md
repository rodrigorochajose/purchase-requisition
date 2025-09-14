Sistema de Gestão de Requisições de Compra
Este é meu projeto para o Desafio Técnico de Desenvolvedor(a) Back-End Júnior.

Este projeto consiste em uma API REST para um sistema de gestão de requisições de compra, permitindo a criação, gestão de itens e o acompanhamento do status até a aprovação ou rejeição.

🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- MySQL
- Prisma
- JWT
- Docker e Docker Compose
- Postman Collection

⚙️ Como Executar o Projeto
Após ter o docker instalado e o projeto clonado, configure as variáveis de ambiente:
Copie o arquivo '.env.example', renomeie-o para '.env' e descomente as linhas.

Inicie os containers:
Execute o comando abaixo para construir as imagens e iniciar os serviços.

docker-compose up -d --build

Em seguida rode o comando para gerar as migrations

docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma generate

Acesse a API:
A API estará disponível em http://localhost:3000.

📜 Documentação da API
Uma Postman Collection está disponível na raiz do projeto (purchase-requisition.postman-collection.json).
Basta importa-lo para o Postman e testar.

🔑 Endpoints da API
Método  | Endpoint              | Descrição

POST    | /auth/register        | cria um novo usuário.
POST    | /auth/login           | Autentica um usuário e retorna um JWT. 

GET     | /users                | Lista todos os usuários.
GET     | /user/:id             | Busca por um usuário específico.
PATCH   | /user/:id             | Atualiza os dados do usuário. 

POST    | /requests             | Cria uma nova requisição de compra com o status draft. 
GET     | /requests             | Lista todas as requisições de compra.
GET     | /requests/:id         | Busca uma requisição específica por ID. 
PATCH   | /requests/:id         | Atualiza os dados de uma requisição.

POST    | /requests/:id/submit  | Muda o status da requisição de draft para submitted.
POST    | /requests/:id/approve | Aprova uma requisição (somente para usuários com a role 'approver').
POST    | /requests/:id/reject  | Rejeita uma requisição (somente para usuários com a role 'approver').

GET     | /reports/summary      | Retorna um resumo da quantidade de requisições por status.

GET     | /history/:id          | Busca o histórico de aprovação da requisição específico por ID da Requisição.

🏗️ Estrutura do Projeto
A arquitetura foi pensada em camadas para manter a clareza e a separação de responsabilidades, facilitando a escalabilidade e a manutenção.

/src
├── /controllers 
├── /dto 
├── /exceptions 
├── /middlewares 
├── /routes 
├── /services 
├── /types
└── /server.ts

🤖 Uso de Inteligência Artificial
Para a construção deste projeto, utilizei ferramentas de IA como o Google Gemini e ChatGPT para auxiliar no esclarecimento de alguns procedimentos. A IA foi usada para:

- Inicialização do Docker: Após a criação do Docker Compose e Dockerfile, o container não funcionava, estava apontando problema no Prisma, usei a IA para tentar esclarecer o que poderia estar acontecendo e como resolver mas não obtive sucesso; Encontrei a solução pelo stackoverflow, o problema foi na inicialização do Prisma, onde ele gerou uma saída para os arquivos, que não estava sendo encontrada no container, feito a mudança da saída no schema, obtive sucesso

- Biblioteca DTOs: Foi utilizada IA para sugerir bibliotecas para criação/validação de DTOs, estou acostumado a usar Nest, onde já vem incluso na criação do projeto e facilitado na hora de escrever os DTOs; após a sugestão

- Configuração Jest + Typescript: foram encontrados problemas ao usar o Jest pelo modo que estava usando as importações do typescript, feito esse ajuste com ajuda da IA

- Auxilio na construção do payload personalizado "/src/types/express.d.ts"

- Auxílio na criação do README.md
