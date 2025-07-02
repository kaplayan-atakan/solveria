# Docker Commands for Solveria Project

## Starting the Application
```bash
# Build and start all services
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d --build

# Start only specific services
docker-compose up mongo backend
```

## Stopping the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete database data)
docker-compose down -v
```

## Development Commands
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs mongo

# Follow logs in real-time
docker-compose logs -f backend

# Restart a specific service
docker-compose restart backend

# Execute commands in running containers
docker-compose exec backend npm install
docker-compose exec mongo mongosh
```

## Database Operations
```bash
# Connect to MongoDB
docker-compose exec mongo mongosh -u admin -p password123 --authenticationDatabase admin

# Import data
docker-compose exec -T mongo mongoimport --host localhost --db solveria --collection users --file /data/users.json

# Export data
docker-compose exec mongo mongoexport --host localhost --db solveria --collection users --out /data/users.json
```

## Troubleshooting
```bash
# Check container status
docker-compose ps

# Remove all containers and images (complete reset)
docker-compose down --rmi all -v
docker system prune -a

# Rebuild specific service
docker-compose build backend --no-cache
```

## Services URLs
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- MongoDB: localhost:27017

## Environment Setup
1. Make sure Docker and Docker Compose are installed
2. Clone the repository
3. Update .env file with your API keys
4. Run: `docker-compose up --build`
