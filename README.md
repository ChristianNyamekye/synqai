# SynqAI 

A privacy-first operating system for AI helpers that manages permissions, stores encrypted memories, and provides a marketplace for AI agents.

## Components

### 1. Local Host (Electron + Node.js)

- Manages local encrypted database
- Handles permission prompts
- Enforces data scoping
- Runs installed AI agents

### 2. Browser Extension (Chrome/Firefox/Web)

- Intercepts and indexes data from web services
- Presents permission prompts
- Bridges browser agents to memory API

### 3. Web Dashboard & Marketplace (React + Next.js)

- Browse and install AI agents
- Manage permissions and subscriptions
- Developer portal for agent creation

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Docker (for running AI agents)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/synqai.git
cd synqai
```

2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install component-specific dependencies
cd desktop && npm install
cd ../extension && npm install
cd ../dashboard && npm install
```

3. Start development servers:

```bash
# Start desktop app
cd desktop && npm run dev

# Start dashboard
cd dashboard && npm run dev

# Build extension
cd extension && npm run build
```

## Project Structure

```
synqai/
├── desktop/           # Electron + Node.js local host
│   ├── src/
│   │   ├── main.ts
│   │   ├── api.ts
│   │   ├── database.ts
│   │   └── docker.ts
├── extension/         # Browser extension
│   ├── src/
│   │   ├── background.ts
│   │   └── content.ts
│   └── manifest.json
├── dashboard/         # React + Next.js web dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx
│   │   │   └── api/
│   │   │       ├── agents.ts
│   │   │       └── payments.ts
├── shared/           # Shared types and utilities
│   ├── src/
│   │   ├── types.ts
│   │   └── utils.ts
└── package.json
```

## Development

### Local Host

- Built with Electron and Node.js
- Manages local encrypted database
- Handles permission prompts
- Runs AI agents in containers

### Browser Extension

- Chrome/Firefox/Web extension
- Intercepts web data
- Presents permission prompts
- Bridges to local host

### Web Dashboard

- React + Next.js application
- Marketplace for AI agents
- Permission management
- Subscription handling

## License

MIT License - see LICENSE file for details
