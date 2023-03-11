Создать новые docker образы:

* docker build --tag navy-gateway-service -f ./docker-gateway-service.dockerfile .
* docker build --tag navy-marketplace-service -f ./docker-marketplace-service.dockerfile .
* docker build --tag navy-web3-service -f ./docker-web3-service.dockerfile .
* docker build --tag navy-web3-worker-service -f ./docker-web3-worker-service.dockerfile .
* docker build --tag navy-gameplay-service -f ./docker-gameplay-service.dockerfile .
* docker build --tag navy-notification-service -f ./docker-notification-service.dockerfile .

Создать пользовательскую bridge сеть:
* docker network create navy-online

Запустить Mongo:
* docker run --rm --net navy-online --name navy-mongodb -v ~/mongo/data:/data/db -d -p 27017:27017 mongo

Запустить Redis:
* docker run --rm --net navy-online --name navy-redis -d -p 6379:6379 redis

Перезапустить все сервисы:
* docker stop navy-gateway-service && docker remove navy-gateway-service

* docker run --rm --net navy-online --name navy-gateway-service -d -p 3022:3022 navy-gateway-service
* docker run --rm --net navy-online --name navy-marketplace-service -d -p 3027:3027 navy-marketplace-service
* docker run --rm --net navy-online --name navy-web3-service -d -p 3020:3020 navy-web3-service
* docker run --rm --net navy-online --name navy-web3-worker-service -d -p 3010:3010 navy-web3-worker-service
* docker run --rm --net navy-online --name navy-gameplay-service -d -p 4020:4020 navy-gameplay-service
* docker run --rm --net navy-online --name navy-notification-service -d -p 3028:3028 navy-notification-service

Связать локальный образ с новым удаленным:
* docker tag navy-marketplace-service:0.1.0 ferret228/navy-marketplace-service:0.1.0

Запушить удаленный образ:
* docker push ferret228/navy-gateway-service:0.1.0
* docker push ferret228/navy-marketplace-service:0.1.0

CI/CD V1:
Скрипт для ручного обновления каждого сервиса на удаленном сервере.
1) Из корневой папки pull master
    * cd /srv/NavyOnlineSource
    * gh repo sync --branch master
2) Обновление зависимостей бэкенда
    * cd server/navy
    * npm i && npm run build
3) Собираем докер образы и указываем релиз версию нужного приложения
    * docker build --tag navy-gateway-service:X.Y.Z -f ./docker-gateway-service.dockerfile .