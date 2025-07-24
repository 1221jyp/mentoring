build:
	cd client && npm run build

start:
	cd client && npm start

dev:
	docker compose up
up:
	docker tag yeolpulta2-server onamsysteam/yeolpumta:latest && docker push onamsysteam/yeolpumta:latest