# device-managemnet-server
code test node app

Node version - 14.15.4 (for full list of libraries and versions please refer package.json)
Deployed to heroku (https://jnj-device-api.herokuapp.com/)
Database used mogodb, used mongodb atlas

health check : https://jnj-device-api.herokuapp.com/healthcheck

api documentation(swagger): https://jnj-device-api.herokuapp.com/api-docs

To Run in local:
Get the code and follow below steps
1. npm install
2. change the CONNECTION_URL with the mongdb atlas url send by mail
3. npm run start


Sample requests

POST : https://jnj-device-api.herokuapp.com/api/v1/devices
Body : {"device": "motE", "os": "Android", "manufacturer": "motorola" }

GET : https://jnj-device-api.herokuapp.com/api/v1/devices

PATCH : https://jnj-device-api.herokuapp.com/api/v1/devices/{id}

DELETE : https://jnj-device-api.herokuapp.com/api/v1/devices/{id}
testing
