<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/full-logo.jpg" />

# Project Description 📝
FinTracer allows users to keep track of their expenses, set budgets, and get personalized reports about their expenses. The system offers a user-friendly and responsive interface for efficient financial management. <br/>
It comes with advanced features such as connecting user's bank accounts, syncing transactions, displaying detailed charts, importing transactions through a CSV etc. <br/>
FinTracer leverages a robust tech stack that provides end-to-end type safety throughout the code-base using TypeScript, Zod Schemas, Hono RPC features, and Tanstack Query.

<img width="100%" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/overview-page1.jpg" />

## Features
- User Management: Users can register, login, and manage their profiles.
- Accounts Management:
    - Plaid API is used to provide functionality of connecting with user’s bank accounts.
    - Automatically synchronize the account’s balances.
- Transactions Management:
    - Users can create, edit, and delete transactions.
    - Users can import transactions in bulk using a CSV file.
    - Plaid API is used to synchronize transactions from connected accounts.
- Budgets Management:
    - Users can create, edit, and delete budgets with assigned time periods.
- Reports and Analytics:
    - Generates financial reports to calculate net income, and expenses.
    - Visualize transaction data through various charts and graphs.
    - Visualize most expenses categories through pie charts.
    - Show ongoing budgets with progress bars.

## Functional Requirements / Use Case Diagram
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/use-case.jpg" />

## Tech Stack

## Frontend
<code title="Next.js"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/nextjs.jpeg"></code>
<code title="Tailwind CSS"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/tailwind-css.png"></code>
<code title="Shadcn/UI"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/shadcn-ui.jpg"></code>
<code title="Tanstack-Query"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/tanstack-query.png"></code>
<code title="Zustand"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/zustand.jpeg"></code>

## Backend
<code title="Hono.js"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/hono.png"></code>
<code title="PostgreSQL"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/postgresql.png"></code>
<code title="Prisma ORM"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/prisma.jpeg"></code>
<code title="Plaid-API"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/plaid.png"></code>
<code title="Auth.js"><img height="35" src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/authjs.png"></code>

## Database Schema ER Diagram
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/er-model.png" />

## Software Interface

### Landing Page
Initial page introducing the software, key features and about sections.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/landing-page.png" />
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/key-features.png" />

### Login / Register Page
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/login-page.png" />
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/register-page.png" />

### Overview
Summary of transactions, expenses, budget status, and account balances.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/overview-page2.png" />
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/overview-page3.png" />

### Transactions
Shows list of all transactions for selected accounts and time-periods.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/transactions-page.png" />

Create/Edit transaction dialog.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/new-transaction.png" />

### Accounts
Shows all the linked bank accounts and their details.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/accounts-page.png" />

Plaid API connecting bank interface.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/plaid-connect.png" />

### Budgets
Shows list of all the created budgets.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/budgets-page.png" />

Create/Edit budget dialog.
<img src="https://github.com/DhruvChadha22/FinTracer/blob/main/public/new-budget.png" />
