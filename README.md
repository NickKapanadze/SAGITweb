# 🎭 Mafia Party Game Platform - SAGIT Web

A production-ready, browser-based party game platform inspired by Kahoot, fully customized for Mafia/Werewolf-style games.

## Overview

This is a full-stack multiplayer game platform with three distinct client types:
- **TV / Main Display** - Public view for showing game state
- **Host / Game Master** - Control interface for managing the game
- **Player Clients** - Mobile-first interface for players on phones or PCs

Players join via 6-digit party codes, receive secret roles, and play in synchronized real-time with server-authoritative game logic.

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js with NestJS
- TypeScript
- PostgreSQL (via TypeORM)
- Redis for session management
- Socket.IO for WebSocket communication

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.IO client

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL 15+ (if running without Docker)
- Redis 7+ (if running without Docker)

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/NickKapanadze/SAGITweb.git
cd SAGITweb
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### Running Locally for Development

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Start PostgreSQL and Redis (via Docker or locally)

5. Run the development server:
```bash
npm run start:dev
```

The backend will be available at http://localhost:3000

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3001

## 🎮 Game Features

### Core Gameplay

- **Multiple Game Phases**: Day discussion, speeches, voting, and night actions
- **Role System**: Citizen, Mafia, Don Mafia, Detective, Doctor, Serial Killer
- **Voting Modes**: Anonymous or visible voting
- **Night Actions**: Kill, heal, and investigate
- **Win Conditions**: Team-based victory conditions

### Client Types

#### TV Display
- Shows party code and QR code for joining
- Displays current game phase and day
- Shows all players (alive/dead status)
- Real-time updates synchronized with host
- No control logic - read-only view

#### Host Control Panel
- Connect using party code
- Configure game rules and settings
- Start, pause, and control game flow
- Manage players and assign fouls
- View real-time voting data
- Control phase transitions

#### Player View
- Join via party code
- Select player slot
- Receive secret role assignment
- Cast votes during voting phase
- Perform night actions based on role
- View personal game status

## 📋 Game Rules

### Default Roles

1. **Citizen** (Team: Citizens)
   - No special abilities
   - Wins by eliminating all Mafia and Serial Killers

2. **Mafia** (Team: Mafia)
   - Can kill one player each night
   - Knows all other Mafia members

3. **Don Mafia** (Team: Mafia)
   - Can check if a player is the Detective
   - Knows all Mafia members

4. **Detective** (Team: Citizens)
   - Can investigate one player per night
   - Cannot check the same player twice

5. **Doctor** (Team: Citizens)
   - Can heal one player per night
   - Limited heals per player

6. **Serial Killer** (Team: Solo)
   - Can kill players at night (limited uses)
   - Wins by being the last player alive

### Win Conditions

- **Citizens**: Eliminate all Mafia and Serial Killers
- **Mafia**: Equal or outnumber Citizens (with no Serial Killer alive)
- **Serial Killer**: Be the last player standing

## 🔧 Configuration

### Game Settings

- Max players (default: 12)
- Timer durations for each phase
- Role distribution
- Voting mode (anonymous/visible)
- Mid-game join allowance
- Auto-kick threshold for fouls
- Ability limits (heals, kills, etc.)

## 🗄️ Database Schema

### Main Entities

- **sessions**: Game session data
- **players**: Player information and status
- **roles**: Role definitions and abilities
- **votes**: Voting records
- **night_actions**: Night phase actions
- **fouls**: Penalty tracking

## 🔌 API Endpoints

### REST API

- `POST /session/create` - Create new game session
- `POST /session/join` - Join existing session
- `POST /session/host/connect` - Connect as host
- `POST /session/reconnect` - Reconnect with token
- `GET /session/:sessionId/state` - Get session state

### WebSocket Events

**Client to Server:**
- `JOIN_SESSION` - Join game session
- `START_GAME` - Start the game (host only)
- `NEXT_PHASE` - Advance to next phase (host only)
- `SUBMIT_VOTE` - Submit vote during voting
- `SUBMIT_NIGHT_ACTION` - Submit night action
- `ASSIGN_FOUL` - Assign foul to player (host only)

**Server to Clients:**
- `SESSION_STATE_UPDATE` - Game state changed
- `ROLE_ASSIGNED` - Role assignment notification
- `VOTE_PROGRESS` - Voting progress update
- `GAME_ENDED` - Game finished with winner

## 🔒 Security Features

- Server-authoritative game logic
- Session-based authentication
- Reconnect tokens for seamless recovery
- Host token validation
- Role information isolation
- Secure WebSocket connections

## 🧪 Development

### Project Structure

```
SAGITweb/
├── backend/
│   ├── src/
│   │   ├── entities/        # Database entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── enums/           # Enumerations
│   │   ├── modules/         # NestJS modules
│   │   │   ├── session/     # Session management
│   │   │   ├── game/        # Game logic
│   │   │   └── websocket/   # WebSocket gateway
│   │   ├── config/          # Configuration
│   │   └── main.ts          # Application entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Next.js pages
│   │   │   ├── tv/          # TV display pages
│   │   │   ├── host/        # Host pages
│   │   │   └── player/      # Player pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # Global styles
│   └── package.json
└── docker-compose.yml
```

### Building for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build

# Or build all with Docker
docker-compose build
```

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

**SAGIT Web** © 2024 - A modern party game platform