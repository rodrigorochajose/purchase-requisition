# Sistema de Gestão de Requisições de Compra

Este projeto é uma **API REST** para um sistema de gestão de requisições de compra. Ele permite a criação, gerenciamento de itens e o acompanhamento do status de uma requisição até sua aprovação ou rejeição.

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express**
- **MySQL**
- **Prisma**
- **JWT**
- **Docker**
- **Postman Collection**

---

## ⚙️ Como Executar o Projeto

Certifique-se de ter o **Docker** instalado.

1.  **Clone o repositório**

2.  **Variáveis de Ambiente:**
    -   Copie o arquivo `.env.example`
    -   Renomeie a cópia para `.env`
    -   Descomente as linhas e preencha as variáveis de ambiente conforme necessário

3.  **Inicie os containers:**
    -   Execute o comando abaixo para construir as imagens e iniciar os serviços em segundo plano.
    ```bash
    docker-compose up -d --build
    ```

4.  **Execute as Migrações do Prisma:**
    -   Acesse o container da API e execute as migrações para configurar o banco de dados.
    ```bash
    docker compose exec api npx prisma migrate deploy
    docker compose exec api npx prisma generate
    ```

5.  **Acesse a API:**
    -   A API estará disponível em `http://localhost:3000`.

---

## 📜 Documentação da API

Uma **Postman Collection** completa está disponível na raiz do projeto (`purchase-requisition.postman-collection.json`). Basta importá-la para o Postman para testar todos os endpoints.

### 🔑 Endpoints da API

| Método | Endpoint                    | Descrição                                                                      |
| :----- | :-------------------------- | :----------------------------------------------------------------------------- |
| `POST` | `/auth/register`            | Cria um novo usuário.                                                          |
| `POST` | `/auth/login`               | Autentica um usuário e retorna um JWT.                                         |
| `GET`  | `/users`                    | Lista todos os usuários. **(Protegido)** |
| `GET`  | `/users/:id`                | Busca um usuário específico por ID. **(Protegido)** |
| `PATCH`| `/users/:id`                | Atualiza os dados de um usuário. **(Protegido)** |
| `POST` | `/requests`                 | Cria uma nova requisição de compra com status `draft`. **(Protegido)** |
| `GET`  | `/requests`                 | Lista todas as requisições de compra. **(Protegido)** |
| `GET`  | `/requests/:id`             | Busca uma requisição específica por ID. **(Protegido)** |
| `PATCH`| `/requests/:id`             | Atualiza os dados de uma requisição. **(Protegido)** |
| `POST` | `/requests/:id/submit`      | Muda o status da requisição de `draft` para `submitted`. **(Protegido)** |
| `POST` | `/requests/:id/approve`     | Aprova uma requisição. (Apenas para usuários com a role **`approver`**)        |
| `POST` | `/requests/:id/reject`      | Rejeita uma requisição. (Apenas para usuários com a role **`approver`**)       |
| `GET`  | `/reports/summary`          | Retorna um resumo da quantidade de requisições por status. **(Protegido)** |
| `GET`  | `/history/:id`              | Busca o histórico de aprovação de uma requisição. **(Protegido)** |

---

## 🏗️ Estrutura do Projeto

A arquitetura foi organizada em camadas para garantir a separação de responsabilidades, o que facilita a escalabilidade e a manutenção.

```
/src
├── /controllers       
├── /dto               
├── /exceptions         
├── /middlewares        
├── /routes             
├── /services          
├── /types          
└── /server.ts        
```
---

## 🤖 Uso de Inteligência Artificial

Ferramentas de IA, como **Google Gemini** e **ChatGPT**, foram utilizadas para auxiliar no desenvolvimento e na resolução de problemas, agilizando o processo.

- **Inicialização do Docker:** Após a criação do Docker Compose e Dockerfile, o container não funcionava, estava apontando problema no Prisma, usei a IA para tentar esclarecer o que poderia estar acontecendo e como resolver mas não obtive sucesso; Encontrei a solução pelo stackoverflow, o problema foi na inicialização do Prisma, onde ele gerou uma saída para os arquivos, que não estava sendo encontrada no container, feito a mudança da saída no schema, obtive sucesso

- **Biblioteca DTOs:** Foi utilizada IA para sugerir bibliotecas para criação/validação de DTOs, estou acostumado a usar Nest, onde já vem incluso na criação do projeto e facilitado na hora de escrever os DTOs; após a sugestão

- **Configuração Jest + Typescript:** foram encontrados problemas ao usar o Jest pelo modo que estava usando as importações do typescript, feito esse ajuste com ajuda da IA

- Auxilio na construção do payload personalizado "/src/types/express.d.ts"

- Auxílio na criação do README.md
