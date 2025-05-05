up:
	docker compose up -d

psql:
	docker exec -it db psql -U postgres -d solaceassignment

migrate:
	npx drizzle-kit push

loaddata:
	curl -X POST http://localhost:3000/api/seed