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