
# HackerNews Server Clone (Node + TypeScript + GraphQL + Prisma)

This is a simplified clone of the [HackerNews](https://news.ycombinator.com/) backend built using **TypeScript**, **GraphQL Yoga**, **Prisma ORM**, and **SQLite**. It provides full **CRUD operations** for Posts and Comments.

---

## 🚀 Features

- ⚙️ TypeScript-based GraphQL server
- 🧵 Prisma ORM with SQLite for development
- 🔄 GraphQL CRUD operations for Posts and Comments
- 🧬 GraphQL Code Generator for automatic resolver typings
- 🔁 Hot-reload support with `tsx watch`

---

## 🧱 Tech Stack

| Tool            | Role                       |
| --------------- | -------------------------- |
| TypeScript      | Language                   |
| GraphQL Yoga    | API server                 |
| Prisma          | ORM                        |
| SQLite          | Database                   |
| GraphQL Codegen | Typed GraphQL resolvers    |
| tsx             | Run TS directly with watch |
| Prettier        | Code formatting            |

---

## 📂 Folder Structure


```
src/
├── graphql/               # GraphQL schema and resolvers
│   ├── schema.graphql     # Root GraphQL schema definition
│   ├── context.ts         # GraphQL context
│   └── server.ts          # GraphQL Yoga server setup
├── post/                  # Post module
│   ├── post.resolvers.ts
│   └── post.service.ts
├── comment/               # Comment module
│   ├── comment.resolvers.ts
│   └── comment.service.ts
├── prisma/
│   ├── client.ts          # Prisma client setup
│   └── seed.ts            # Optional: seed data
├── main.ts                # Entry point
└── generated/             # Auto-generated GraphQL resolver types

```

---

## 🛠️ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/your-username/hackernews-node-ts
cd hackernews-node-ts
npm install
````

### 2. Prisma Setup

```bash
npx prisma init --datasource-provider sqlite
npx prisma generate
npx prisma migrate dev --name init
```

(If you have a `prisma/schema.prisma` file already set up with `Post` and `Comment` models, this will apply your DB schema.)

### 3. Codegen

```bash
npx graphql-codegen
```

This generates typed resolvers in the `src/generated/` directory.

### 4. Run the Server

```bash
npm run dev
```

Your GraphQL server will be running on:
👉 `http://localhost:4000/graphql`

---

## 📌 Example Queries

### Create Post

```graphql
mutation {
  postLink(url: "https://github.com/", description: "GitHub: Code hosting platform for collaboration, version control, and deployment.") {
    id
    url
    description
  }
}
```

### Fetch All Links with Comments

```graphql
query {
	feed{
    id
    url
    description
    comments{
      id
      body
      createdAt
    }
  }
}
```

### Fetch Links with id

```graphql
query {
	link(id: 1){
    id 
    url
    description
  }
}
```

### Filtration 

```graphql
query {
	feed(filterNeedle: "QL"){
    id
    url
    description
  }
}
```

### Pagination

```graphql
query {
	feed(skip:0, take: 5){
    id
    url
    description
  }
}
```
---


## ⚙️ Available Scripts

| Command               | Description                   |
| --------------------- | ----------------------------- |
| `npm run dev`         | Start the server in dev mode  |
| `npm start`           | Run server without watch mode |
| `npx prisma`          | Run Prisma CLI                |
| `npx graphql-codegen` | Generate typed resolvers      |

---
