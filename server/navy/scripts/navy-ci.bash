#!/bin/bash

cd /srv/NavyOnlineSource
gh repo sync --branch venom-hackathon
cd server/navy

echo 'Choose an app to deploy:'
echo '1. auth-service'
echo '2. gameplay-balancer-service'
echo '3. gameplay-service'
echo '4. gateway-service'
echo '5. marketplace-service'
echo '6. notification-service'
echo '7. user-service'
echo '8. web3-service'
echo '9. web3-worker-service'
echo '10. world-service'
echo '11. entity-service'

read app

appServiceName=""
appServicePort=0
appDockerfile=""

if [ $app -eq 1 ]
then
    appServiceName="navy-auth-service"
    appDockerfile="docker-auth-service.dockerfile"
    appServicePort=3026
fi
if [ $app -eq 2 ]
then
    appServiceName="navy-gameplay-balancer-service"
    appDockerfile="docker-gameplay-balancer-service.dockerfile"
    appServicePort=3024
fi
if [ $app -eq 3 ]
then
    appServiceName="navy-gameplay-service"
    appDockerfile="docker-gameplay-service.dockerfile"
    appServicePort=4020
fi
if [ $app -eq 4 ]
then
    appServiceName"navy-gateway-service"
    appDockerfile="docker-gateway-service.dockerfile"
    appServicePort=3022
fi
if [ $app -eq 5 ]
then
    appServiceName="navy-marketplace-service"
    appDockerfile="docker-marketplace-service.dockerfile"
    appServicePort=3027
fi
if [ $app -eq 6 ]
then
    appServiceName="navy-notification-service"
    appDockerfile="docker-notification-service.dockerfile"
    appServicePort=3028
fi
if [ $app -eq 7 ]
then
    appServiceName="navy-user-service"
    appDockerfile="docker-user-service.dockerfile"
    appServicePort=3023
fi
if [ $app -eq 8 ]
then
    appServiceName="navy-web3-service"
    appDockerfile="docker-web3-service.dockerfile"
    appServicePort=3020
fi
if [ $app -eq 9 ]
then
    appServiceName="navy-web3-worker-service"
    appDockerfile="docker-web3-worker-service.dockerfile"
    appServicePort=3010
fi
if [ $app -eq 10 ]
then
    appServiceName="navy-world-service"
    appDockerfile="docker-world-service.dockerfile"
    appServicePort=3021
fi
if [ $app -eq 11 ]
then
    appServiceName="navy-entity-service"
    appDockerfile="docker-entity-service.dockerfile"
    appServicePort=3029
fi

docker build --tag $appServiceName -f ./$appDockerfile .
docker stop $appServiceName
docker run --rm --net navy-online --name $appServiceName -d -p $appServicePort:$appServicePort $appServiceName