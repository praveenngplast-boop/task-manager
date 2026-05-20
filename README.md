# Task Manager (Keyboard-First Productivity Workspace)

A modern, highly-interactive, and keyboard-first productivity application designed for seamless task and project management. Built with React, Vite, and Tailwind CSS, this app offers a premium user interface with advanced features like a Command Palette, Kanban boards, interactive dashboards, and rich animations.

## 🚀 Features

- **Keyboard-First Design:** Accelerate your workflow using comprehensive keyboard shortcuts (`Ctrl+K` for Command Palette, `Ctrl+N` for new tasks, `Ctrl+/` for cheatsheet).
- **Multiple Views:**
  - 📊 **Dashboard:** Analytics and overviews of your productivity.
  - 📝 **Task Board:** Detailed list and management of tasks.
  - 📋 **Kanban Board:** Visual drag-and-drop workflow management.
  - 📓 **Notes:** Built-in rich note-taking system.
- **Advanced State Management:** Auto-saving, Undo/Redo capabilities, and comprehensive filtering.
- **Export Capabilities:** Easily export your tasks and data to Excel and PDF formats.
- **Beautiful UI/UX:**
  - Smooth animations powered by Framer Motion.
  - Responsive glassmorphism design.
  - Particle-based animated background.
  - Full Dark/Light mode support.

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React & React Icons
- **Animations:** Framer Motion & Canvas Confetti
- **Charts:** Recharts
- **Export:** jsPDF & SheetJS (xlsx)

## 📦 Getting Started

### Prerequisites

Make sure you have Node.js (version 16+ recommended) and npm installed.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd "task manager"
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 🏗️ Build for Production

To build the application for production, run:

```bash
npm run build
```

This will generate a `dist` folder containing the optimized, minified production build. You can preview it using:

```bash
npm run preview
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open Command Palette |
| `Ctrl + N` | Create New Task |
| `Ctrl + /` | Toggle Shortcuts Help |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is private and proprietary.
