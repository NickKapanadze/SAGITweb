# Architecture Overview

This document describes the architecture of the Mafia Party Game Platform.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
├─────────────┬─────────────────┬────────────────────────────┤
│  TV Display │  Host Client    │  Player Clients (Mobile)   │
│  (Read-Only)│  (Controller)   │  (Interactive)             │
└─────────────┴─────────────────┴────────────────────────────┘
                        │
                        │ WebSocket + REST
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Session    │  │     Game     │  │  WebSocket   │     │
│  │   Module     │  │   Module     │  │   Gateway    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                        │
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌──────────────┐              ┌──────────────┐
│  PostgreSQL  │              │    Redis     │
│  (Database)  │              │   (Cache)    │
└──────────────┘              └──────────────┘
```

## Core Components

### Frontend (Next.js)

#### 1. TV Display (`/tv/[partyCode]`)
**Purpose**: Public display for showing game state

**Features**:
- Party code and QR code display
- Current game phase
- Player list with alive/dead status
- Speaking order indicator
- Read-only, no user input

**State Management**:
- WebSocket connection for real-time updates
- Local state for UI rendering
- No sensitive data (roles hidden)

#### 2. Host Client (`/host/[partyCode]`)
**Purpose**: Game master control interface

**Features**:
- Game configuration
- Phase control (start, next, pause)
- Player management
- Foul assignment
- Full voting visibility

**Capabilities**:
- Start/stop game
- Advance phases
- Kick/restore players
- View all game data including votes

#### 3. Player Client (`/player/[playerId]`)
**Purpose**: Individual player interface

**Features**:
- Role display (secret)
- Voting interface
- Night action submission
- Personal game status

**Security**:
- Only sees own role
- Reconnect token for session recovery
- One device per player slot enforcement

### Backend (NestJS)

#### 1. Session Module
**Responsibilities**:
- Session creation and management
- Player join/reconnect
- Party code generation
- Host authentication

**API Endpoints**:
- `POST /session/create` - Create new game
- `POST /session/join` - Join as player
- `POST /session/host/connect` - Connect as host
- `POST /session/reconnect` - Reconnect with token
- `GET /session/:id/state` - Get current state

#### 2. Game Module
**Responsibilities**:
- Game state machine
- Role assignment
- Win condition checking
- Voting resolution
- Night action resolution

**State Machine**:
```
LOBBY → DAY_DISCUSSION → DAY_SPEECHES → DAY_VOTING → VOTE_RESULTS
  ↑                                                         ↓
  │                                                    Check Win?
  │                                                         ↓
  │                                                    NIGHT_MAFIA
  │                                                         ↓
  │                                                    NIGHT_SERIAL
  │                                                         ↓
  │                                                    NIGHT_DOCTOR
  │                                                         ↓
  │                                                    NIGHT_DETECTIVE
  │                                                         ↓
  │                                                    NIGHT_RESOLUTION
  │                                                         ↓
  │                                                    Check Win?
  │                                                         ↓
  └─────────────────── GAME_END ←───────────────────────────┘
```

#### 3. WebSocket Gateway
**Responsibilities**:
- Real-time client communication
- Event broadcasting
- Connection management
- Client type routing

**Events**:
- Session management
- Game state updates
- Vote submissions
- Night actions
- Host commands

### Database (PostgreSQL)

#### Schema

**sessions**:
- Session metadata
- Party code
- Current game state
- Configuration (JSON)

**players**:
- Player information
- Role assignment
- Status (alive/dead)
- Reconnect tokens

**roles**:
- Role definitions
- Abilities (JSON)
- Team affiliation

**votes**:
- Voting records
- Phase tracking
- Visibility mode

**night_actions**:
- Night phase actions
- Resolution status
- Results (JSON)

**fouls**:
- Penalty tracking
- Timestamps
- Reasons

### Cache (Redis)

**Usage**:
- Session locks
- Live player connections
- Temporary game state
- Rate limiting

## Data Flow

### Session Creation
```
1. Host creates session
2. Backend generates party code
3. Backend creates session in DB
4. Backend returns party code + host token
5. Host joins WebSocket with token
6. TV displays party code + QR
```

### Player Join
```
1. Player enters party code
2. Player selects slot + nickname
3. Backend validates slot availability
4. Backend creates player record
5. Backend generates reconnect token
6. Player joins WebSocket
7. All clients receive update
```

### Game Start
```
1. Host clicks "Start Game"
2. Backend validates player count
3. Backend assigns roles randomly
4. Backend sends role to each player
5. Backend transitions to DAY_DISCUSSION
6. All clients receive state update
```

### Voting Flow
```
1. Backend transitions to DAY_VOTING
2. Players submit votes via WebSocket
3. Backend stores votes
4. If VISIBLE mode:
   - Broadcast to all clients
5. If ANONYMOUS mode:
   - Show count to host only
6. Host advances to VOTE_RESULTS
7. Backend resolves votes
8. Backend eliminates player (if any)
9. All clients receive results
```

### Night Phase Flow
```
1. Backend transitions to NIGHT_MAFIA
2. Mafia players see kill interface
3. Mafia submit collective kill
4. Backend transitions to NIGHT_SERIAL
5. Serial Killer submits kill
6. Backend transitions to NIGHT_DOCTOR
7. Doctor submits heal
8. Backend transitions to NIGHT_DETECTIVE
9. Detective submits check
10. Backend transitions to NIGHT_RESOLUTION
11. Backend resolves all actions:
    - Apply heals
    - Execute kills
    - Process checks
12. All clients receive results
```

## Security Model

### Authentication
- **Host**: Host token (UUID)
- **Player**: Reconnect token (UUID)
- **Session**: Session ID (UUID)

### Authorization
- Host can control game
- Players can only submit own actions
- TV has read-only access

### Data Isolation
- Players only see own role
- Votes hidden in anonymous mode
- Night actions are private
- Host sees everything

### Connection Security
- One device per player slot
- Reconnect token validation
- WebSocket authentication
- CORS protection

## Scalability

### Horizontal Scaling
- Stateless backend instances
- Shared PostgreSQL
- Shared Redis
- Load balancer with sticky sessions

### Performance Optimizations
- Redis caching
- Database indexing
- Connection pooling
- WebSocket connection limits

### Monitoring
- Health checks
- Error tracking
- Performance metrics
- Database queries

## Technology Choices

### Why NestJS?
- TypeScript support
- Modular architecture
- Built-in WebSocket support
- Dependency injection
- Easy testing

### Why Next.js?
- Server-side rendering
- TypeScript support
- File-based routing
- API routes
- Production-ready

### Why PostgreSQL?
- ACID compliance
- JSON support (JSONB)
- Strong typing
- Reliability
- Mature ecosystem

### Why Redis?
- In-memory speed
- Pub/sub support
- Session storage
- Simple API

### Why Socket.IO?
- Automatic reconnection
- Room support
- Fallback to polling
- Browser compatibility
- Mature library

## Design Patterns

### Backend Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Gateway Pattern**: WebSocket communication
- **DTO Pattern**: Data validation

### Frontend Patterns
- **Custom Hooks**: Reusable logic
- **Component Composition**: UI reusability
- **State Management**: Local state + WebSocket
- **Responsive Design**: Mobile-first approach

## Future Enhancements

### Short-term
- Custom roles builder
- Timer system
- Undo functionality
- Vote results visualization

### Long-term
- Multiple game modes
- Tournament support
- Statistics tracking
- Replay system
- Admin dashboard
- Mobile apps (React Native)

## Contributing

See CONTRIBUTING.md for development guidelines.
