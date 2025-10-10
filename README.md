# React Role Auth Context

A front-end only **role-based authentication system** built with **React + Context API + React Router**, featuring
persistent login, role hierarchy, and protected routes - all without a backend.

### 🔗 Links

-   **GitHub Repo:** [https://github.com/a2rp/react-role-auth-context](https://github.com/a2rp/react-role-auth-context)
-   **Live Demo:** [https://a2rp.github.io/react-role-auth-context](https://a2rp.github.io/react-role-auth-context)

---

### 🧠 Overview

This project demonstrates a **clean RBAC (Role-Based Access Control)** structure using only React and localStorage:

| Role     | Accessible Pages                       |
| -------- | -------------------------------------- |
| Root     | Root, Admin, Employee                  |
| Admin    | Admin, Employee                        |
| Employee | Employee                               |
| Guest    | Public pages only (Home, About, Login) |

### ⚙️ Features

-   Role-based route protection (`Root`, `Admin`, `Employee`)
-   Context-based global auth state
-   Persistent login via `localStorage`
-   Public + Private + RoleRoute wrappers
-   Dynamic sidebar navigation by role
-   Unauthorized & 404 fallback pages
-   Light/Dark theme toggle

---

### 🚀 Clone and Run Locally

```bash
# Clone the repository
git clone https://github.com/a2rp/react-role-auth-context.git

# Enter project directory
cd react-role-auth-context

# Install dependencies
npm install

# Start development server
npm run dev
```
