# SaaS Management System

A fully functional single-tenant SaaS system for client, ticket, and service management.  
Backend is built with **Node.js, Express, Prisma 7** and PostgreSQL.  
Frontend is built with **React + TypeScript + TailwindCSS**.

This repository uses a **monorepo structure**:

root
├── server/ # Backend
└── client/ # Frontend



---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Database](#database)
- [Project Structure](#project-structure)

---

## Features

- Manage clients, tickets (service orders), and services
- Upload files attached to tickets
- Feature-based architecture for easy scalability
- Fully tested with Postman
- Ready for production

---

## Requirements

- Node.js v18+  
- npm v9+  
- PostgreSQL v15+  
- Git  

---

## Setup

### Environment Variables

Create a `.env` file in the **server/** folder based on `.env.example`:


> Replace `user`, `password`, `localhost`, and `saasdb` with your PostgreSQL credentials.  

### Backend Setup

```bash
cd server
npm install

# Run Prisma migrations (creates tables)
npx prisma migrate dev

# Start development server
npm run dev

The backend will run at: http://localhost:3333


Frontend Setup

cd ../client
npm install

# Start frontend server
npm start

The frontend will run at: http://localhost:3000


Usage

Navigate to http://localhost:3000 to use the application

API endpoints are under http://localhost:3333

Example Postman collection is included in /docs (optional)

Database

We use PostgreSQL as the database. Prisma 7 handles migrations and client generation.
Tables:

clients

tickets

services

photos (attachments)


Project Structure

Backend (server/)

server/
├── prisma/            # Prisma schema & migrations
├── src/
│   ├── features/      # Feature-based: clients, tickets, services
│   ├── lib/           # Transversal helpers: prisma client, validation, error handler
│   ├── routes.ts      # Root routes aggregating features
│   ├── server.ts      # Express server
│   └── uploads/       # File uploads
├── package.json
└── tsconfig.json

Frontend (client/)

client/
├── src/
│   ├── features/      # Feature-based logic: hooks, forms, lists
│   ├── pages/         # Screens composing UI
│   ├── lib/           # Transversal helpers: API client, toast
│   ├── App.tsx        # Root component
│   └── index.tsx      # Entry point
├── package.json
└── tsconfig.json

Notes

Single-tenant: no authentication implemented

Feature-based structure allows easy scalability and clear separation of concerns

Uploads folder is ignored in Git (.gitignore)

Backend tested with Postman

Frontend tested locally


License

MIT


---

# `.env.example`

```env
# PostgreSQL connection URL
DATABASE_URL=postgresql://user:password@localhost:5432/saasdb

# Backend port
PORT=3333
