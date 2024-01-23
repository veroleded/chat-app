startdev: install dev


install:
		cd frontend && npm install
		cd backend && npm install

dev:
		docker-compose -f docker-compose.dev.yaml up --build

prod:	docker-compose -f docker-compose.prod.yaml up --build