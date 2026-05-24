# Back-end — Muralis

API REST em Node.js + TypeScript para gerenciamento de despesas.

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v14+

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=dev
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASSWORD=senha
```

## Banco de dados

Crie o banco no PostgreSQL como o nome de "despesas" e execute o script de setup para criar as tabelas:

```bash
npm run db:setup
```

## Rodando o projeto

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot-reload |
| `npm run db:setup` | Cria as tabelas no banco de dados |
| `npm run lint` | Verifica erros de lint |
| `npm run lint:fix` | Corrige erros de lint automaticamente |
| `npm run test` | Inicia os testes com jest |
