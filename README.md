## Kanban Board Project

**A dynamic Kanban board application built with React, featuring drag-and-drop functionality, task management, and bounty system integration.**

### Features

* Drag and drop tasks between columns
* Create, edit, and delete tasks
* Assign tasks with bounties
* Task status management
* Real-time updates

### Prerequisites

* Node.js (LTS version) 10
* npm (comes bundled with Node.js) 10

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd kanban-board
```
2. Install dependencies:

```
npm install
```
### Project Structure

```
kanban-board/
├── src/
│   ├── app.jsx
│   ├── app.css
│   └── components/
│       └── ui/
│           └── card.tsx
├── package.json
└── README.md
```
### Running the Application
1. Install the required UI components:
```
pnpm dlx shadcn@latest add card
```
2. Start the development server:
```
npm run dev
```
3. Open your browser and navigate to http://localhost:3000
4. To stop the development server, press Ctrl + C in the terminal.

