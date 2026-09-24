# Social API

API REST de rede social com usuários, posts, comentários, likes e follows. Autenticação JWT (access + refresh token), cache com Redis, paginação e testes com Vitest.

Arquitetura em camadas: controller → service → repository.

## Stack

- Node.js + Express 5 + TypeScript
- Prisma + MySQL
- Redis (cache e refresh tokens)
- JWT + bcrypt
- Zod (validação)
- Helmet, CORS, rate limiting
- Vitest (testes)
- Docker Compose (MySQL + Redis)

## Estrutura

```
src/
├── controllers/   # recebem a requisição e devolvem a resposta
├── services/      # regras de negócio
├── repositories/  # acesso ao banco (Prisma)
├── middlewares/   # auth, paginação, rate limit, logger
├── dto/           # validações com Zod
├── utils/         # JWT, Redis, cache, erros
├── config/        # variáveis de ambiente
└── server.ts      # ponto de entrada
```

## Rotas

Base: `/api/v1`

### Públicas

| Método | Rota | Descrição |
|---|---|---|
| POST | `/register` | Criar conta |
| POST | `/login` | Login |
| POST | `/auth/refresh` | Renovar access token |
| GET | `/health` | Health check |

### Autenticadas (`Authorization: Bearer <token>`)

**Posts**

| Método | Rota | Descrição |
|---|---|---|
| POST | `/post` | Criar post |
| PATCH | `/post/:id` | Editar post |
| GET | `/posts` | Listar posts (paginado) |
| GET | `/post/:id` | Buscar post |

**Comentários**

| Método | Rota | Descrição |
|---|---|---|
| POST | `/post/:id/comment` | Comentar |
| GET | `/post/:id/comments` | Listar comentários do post (paginado) |
| GET | `/comment/:id` | Buscar comentário |
| PATCH | `/comment/:id` | Editar comentário |

**Likes**

| Método | Rota | Descrição |
|---|---|---|
| POST | `/post/:id/like` | Curtir |
| DELETE | `/post/:id/like` | Descurtir |
| GET | `/post/:id/likes` | Listar likes do post (paginado) |

**Follow**

| Método | Rota | Descrição |
|---|---|---|
| POST | `/user/:id/follow` | Seguir usuário |
| DELETE | `/user/:id/follow` | Deixar de seguir |
| GET | `/user/:id/followers` | Listar seguidores (paginado) |
| GET | `/user/:id/following` | Listar seguindo (paginado) |
