# Quick Start Guide

Get the Mafia Party Game Platform running in 5 minutes!

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

That's it! No need to install Node.js, PostgreSQL, or Redis separately.

## Step 1: Clone the Repository

```bash
git clone https://github.com/NickKapanadze/SAGITweb.git
cd SAGITweb
```

## Step 2: Start the Application

```bash
docker-compose up -d
```

This will:
- Pull and start PostgreSQL
- Pull and start Redis
- Build and start the backend server
- Build and start the frontend server

**Note**: First-time setup takes 3-5 minutes as Docker builds the images.

## Step 3: Access the Application

Open your browser and go to:

**http://localhost:3001**

## Step 4: Create Your First Game

### On a TV/Projector (or large screen):

1. Click **"TV Display"**
2. Click **"Create Session"**
3. A 6-digit party code will appear
4. A QR code will also be displayed

### On Your Phone/Computer (Host):

1. Visit http://localhost:3001
2. Click **"Host"**
3. Enter the party code
4. Configure game settings
5. Click **"Start Game"** when ready

### On Player Phones:

1. Visit http://localhost:3001
2. Click **"Player"**
3. Enter the party code
4. Choose a player slot
5. Enter your nickname
6. Wait for host to start

## Playing the Game

### Game Flow

1. **Day Discussion**: Players discuss who might be Mafia
2. **Final Speeches**: Each player makes a final statement
3. **Voting**: Vote to eliminate a player
4. **Night**: Players with night abilities take actions
   - Mafia kills
   - Doctor heals
   - Detective investigates
5. Repeat until a team wins

### Win Conditions

- **Citizens win**: Eliminate all Mafia and Serial Killers
- **Mafia wins**: Equal or outnumber Citizens
- **Serial Killer wins**: Last player standing

## Common Commands

### View Logs
```bash
docker-compose logs -f
```

### Stop the Application
```bash
docker-compose down
```

### Restart the Application
```bash
docker-compose restart
```

### Clean Start (removes all data)
```bash
docker-compose down -v
docker-compose up -d
```

## Default Roles

| Role | Team | Ability |
|------|------|---------|
| **Citizen** | Citizens | No special ability |
| **Mafia** | Mafia | Kill at night |
| **Don Mafia** | Mafia | Check if player is Detective |
| **Detective** | Citizens | Investigate players |
| **Doctor** | Citizens | Protect players |
| **Serial Killer** | Solo | Kill at night (limited) |

## Tips for First-Time Players

1. **Start small**: Play with 4-6 players first
2. **Use simple roles**: Citizen and Mafia only
3. **Keep it quick**: Use 2-minute timers
4. **Explain rules**: Brief players before starting
5. **Have fun!**: It's a party game!

## Troubleshooting

### Can't access the application?

Check if containers are running:
```bash
docker-compose ps
```

All services should show "Up" status.

### Frontend won't load?

1. Check backend is running: http://localhost:3000
2. Clear browser cache
3. Try incognito/private mode

### Players can't join?

1. Ensure all devices are on same network
2. Use the computer's IP instead of localhost
3. Check firewall settings

### Database errors?

Reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Check [README.md](README.md) for detailed documentation

## Need Help?

- Open an issue on [GitHub](https://github.com/NickKapanadze/SAGITweb/issues)
- Check the documentation files
- Review logs with `docker-compose logs`

---

**Enjoy the game!** 🎭
