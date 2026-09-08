# GitHub Workspace Analyzer

An elegant, modern full-stack developer workspace and repository analyzer powered by React, Express, Vite, and Google Gemini AI.

## Description
This workspace offers a beautiful single-view bento-grid dashboard where developers can connect their GitHub accounts securely or search public repositories to explore codebase highlights, manage issues, and get real-time, context-aware development reviews from Gemini.

## Features
- **Secure Token Auth**: Manage Personal Access Tokens (PAT) safely inside local browser storage.
- **Repository Selector**: Explore public users or load private workspaces dynamically.
- **Interactive Issue Tracker**: Read, review, and report repository issues with an inline reporter.
- **Gemini AI Co-Pilot**: Server-side proxy for Gemini 3.8 Flash to analyze READMEs and structural metadata.
- **Lego-Cellular Framework**: Zero heavy dependencies, with high-performance modular boundaries.

## Installation
Configure your environment keys first:
```bash
cp .env.example .env
# Open .env and add your GEMINI_API_KEY
```

Install and run the dev environment:
```bash
npm install
npm run dev
```

## Usage
1. Connect using a GitHub PAT to access private repos, or simply enter a username to explore public repos.
2. Select a repository to load its statistics and README file.
3. Chat with the AI Co-Pilot on the right to review code, draft features, or formulate checklists.
4. Use the Issue form to report bugs or request enhancements directly to GitHub.

## Contribution Guidelines
To preserve the robust modularity of the project, please respect these core coding rules:
- **Length Constraint**: No single source code file may exceed **125 lines**. Split complex logic early.
- **Isolate Modules**: Communcation between directories must happen exclusively via `core/dispatcher.ts`.
- **Atomic Styles**: Use components inside `src/shared/atoms` to build unified visual elements.

## License
Licensed under the [MIT License](LICENSE).

### What does this license mean in simple terms?
- **Commercial Use & Modification**: You can use, copy, modify, and sell this software for any personal or business project.
- **Distribution**: You can distribute the code freely as long as you include the original copyright and license notice.
- **No Liability (As-Is)**: The software is provided without any warranty. The author cannot be held liable for any issues or damages.
