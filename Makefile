up:
	docker compose up

down:
	docker compose down

build:
	docker compose up --build

seed:
	docker compose exec api node ./seeders/seedBrandsAndModels.js

delete:
	docker compose down -v

rebuild:
	docker compose down
	docker volume rm carstockmarketbe_api_node_modules
	docker compose up --build