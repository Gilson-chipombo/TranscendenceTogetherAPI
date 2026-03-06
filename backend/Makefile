NAME = Trans

COMPOSE = docker compose
COMPOSE_FILE = docker-compose.yml
ENV_FILE = .env

all:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "Criando .env..."; \
		echo "DATABASE_URL=\"postgresql://transcendence:transcendence123@localhost:54321/transcendence_db?schema=public\"" >  .env; \
	fi

	$(COMPOSE) -f $(COMPOSE_FILE) up -d --build

	@if [ ! -d node_modules ]; then \
		npm install; \
	fi
clean:
	$(COMPOSE) -f $(COMPOSE_FILE) down

fclean:
	$(COMPOSE) -f $(COMPOSE_FILE) down -v
	docker system prune -af

re: fclean all