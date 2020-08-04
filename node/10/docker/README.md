## 同时部署mongo和mongo-express
```yml
#docker-compose.yml
version: '3.1'
services:
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081

```

运行docker-compose
``` bash
# 运行 
docker-compose up
# 后台运行 
docker-compose up -d
```