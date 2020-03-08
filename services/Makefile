create-rabbit-container:
	docker run --name myproject-rmq -e RABBITMQ_DEFAULT_USER=root -e RABBITMQ_DEFAULT_PASS=toor -p 5672:5672 -p 15672:15672 -d rabbitmq:3-management

run-rabbit:
	docker start myproject-rmq

run-kodok:
	figlet Kodok
	export KODOK_HTTP_PORT=3011 && export KODOK_EVENT=kodok && export RMQ_HOST=0.0.0.0 && export RMQ_PORT=5672 && export RMQ_USER=root && export RMQ_PASSWORD=toor && export RMQ_VHOST=/ && cd kodok && npm start

run-siput:
	figlet siput
	export SIPUT_HTTP_PORT=3012 && export SIPUT_EVENT=siput && export RMQ_HOST=0.0.0.0 && export RMQ_PORT=5672 && export RMQ_USER=root && export RMQ_PASSWORD=toor && export RMQ_VHOST=/ && cd siput && npm start

test-all:
	curl http://localhost:3011/
	curl http://localhost:3012/
	curl http://localhost:3011/pesan-ke-siput\?pesan=es-teh
	curl http://localhost:3012/
	curl http://localhost:3011/pesan-ke-siput\?pesan=es-jeruk
	curl http://localhost:3012/

build-kodok-image:
	cd kodok && docker build -t kodok .

build-siput-image:
	cd siput && docker build -t siput .

create-docker-network:
	docker network create mynetwork

connect-rabbit-to-network:
	docker network connect mynetwork myproject-rmq

create-kodok-container:
	docker run --name gamabunta --net=mynetwork -e RMQ_HOST=myproject-rmq -e RMQ_PORT=5672 -e RMQ_USER=root -e RMQ_PASSWORD=toor -e RMQ_VHOST=/ -p 8081:3000 -it -d kodok

create-siput-container:
	docker run --name katsuyu --net=mynetwork -e RMQ_HOST=myproject-rmq -e RMQ_PORT=5672 -e RMQ_USER=root -e RMQ_PASSWORD=toor -e RMQ_VHOST=/ -p 8082:3000 -it -d siput

run-kodok-container:
	docker start gamabunta

run-siput-container:
	docker start katsuyu

test-all-docker:
	curl http://localhost:8081/
	curl http://localhost:8082/
	curl http://localhost:8081/pesan-ke-siput\?pesan=es-teh
	curl http://localhost:8082/
	curl http://localhost:8081/pesan-ke-siput\?pesan=es-jeruk
	curl http://localhost:8082/
