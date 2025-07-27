# SavCycle (Ikimina)

SavCycle (Ikimina) is a fullstack web application that digitizes traditional community saving groups (Ikimina) to help users contribute and receive payouts based on flexible strategies (Random, Fixed Order, or By Need).

## Features

-  User Authentication (JWT or Firebase)
-  Group Creation with Custom Payout Strategies
-  Member Contributions Tracking
-  Payout Scheduling Logic
-  Dashboard with Savings Overview
-  REST API with secure endpoints

## Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | Next.js, Tailwind CSS |
| Backend   | Node.js, Express      |
| Database  | PostgreSQL            |
| Auth      | JWT                   |
| Hosting   | Vercel & Render       |

## System Architecture

```
Frontend (Next.js) ↔️ REST API (Express.js) ↔️ PostgreSQL DB
                   ↕️
                JWT Auth
```

## 📂 Folder Structure

```
/savcycle                       - Next.js frontend
/savcycle /backend_application  - Node.js/Express backend
```

##  API Endpoints

| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| POST   | /api/users/signin      | Register a user         |
| POST   | /api/users             | Login and get JWT       |
| POST   | /api/groups            | Create group            |
| POST   | /api/groups/join       | Join group with code    |
| GET    | /api/members/my-group  | Fetch group data        |
| POST   | /api/contributions     | Add user contribution   |
| POST   | /api/Payouts           | The payout orders       |

## Local Development

### Backend

Make sure your `.env` file includes your `DATABASE_URL` pointing to the PostgreSQL instance with DB_URL, JWT_SECRET.

```bash
cd backend_application
npm install
npx node-pg-migrate up
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

## Documentation

- [Final Project Report](https://docs.google.com/document/d/16lj6aZ6LEnMOKjw38zsv0uOXmzZniNYPuSaRCjDve84/edit?tab=t.0)

## Demo

Watch our walkthrough video: [Demo Video Link](https://drive.google.com/file/d/1XTib2Wtlzv41FabLqMty5yB1iulyou8f/view?usp=sharing)

> Built for the Final Project submission | July 2025
