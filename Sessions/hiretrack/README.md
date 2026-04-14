# HireTrack 🚀

**Organize your job search. Land your dream role.**

Welcome to HireTrack! This application is designed to bring order to the chaos of the modern job search.

### 🔗 Live Application
**[View the Deployed Application Here](https://hiretrack-kappa.vercel.app/auth/signin)** 

---

## 🎯 The Goal

HireTrack’s goal is simple: **To replace messy spreadsheets and disorganized folders with a streamlined, Kanban-style visual dashboard.** 

## 💡 The Problem It Solves

**The Problem:** Job seekers today apply to dozens, sometimes hundreds, of companies across multiple platforms (LinkedIn, Naukri, Company Sites, etc.). Keeping track of who you applied to, which round you are in, deadlines, expected salaries, and key notes usually requires a complicated array of files and bookmarks. It leads to missed deadlines and poorly prepared interviews.

**The Solution:** HireTrack centralizes everything in beautifully structured Kanban boards. You can:
- Visually drag and drop applications across different stages (e.g., Applied ➡️ Interview ➡️ Offer).
- Keep track of important deadlines, roles, expected salary, and application links in one place.
- Organize specific job search campaigns into their own standalone boards (e.g., "Frontend Roles 2026" vs "Fullstack Options").
- Effortlessly get a high-level view of your current statuses, increasing your confidence and control over your career transition.

---

## 🛠️ Tech Stack
- **Frontend Framework:** Angular 21 (Reactive Forms, Signals for global state)
- **Styling:** Tailwind CSS (Modern, premium aesthetics with fluid interactions)
- **Backend/Database:** Supabase (PostgreSQL, seamless API logic, robust authentication)
- **Hosting:** Vercel

---

## How to Run Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### 1. Prerequisites 
- **Node.js** (v18+)
- **Angular CLI** installed globally (`npm install -g @angular/cli`)

### 2. Standard Installation

**Clone the repository & install dependencies:**
```bash
git clone -b https://github.com/devamsatasiya-bacancy/Angular-Training-2026.git
cd Angular-Training-2026/Sessions/hiretrack
npm install
```

### 3. Environment Setup
Create `environment.ts` file using `environment.ts.example` inside the `src/environments` folder to connect to Supabase instance:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm start
```
This single command securely loads the environment variables and bootstraps the Angular development server.
Navigate to **`http://localhost:4200/`** to view the application in your browser.

---

## 👨‍💻 Contributing

Open for bug fixes and new features!

**Happy Job Hunting! 🎉**