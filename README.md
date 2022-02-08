# URLShortener

Quick sketch of a url shortener to get familiar with simple database sharding in Postgres

## Requirements

- Docker
- Postgres
- PGAdmin
- Node
  - Express
  - Hashring

## Installation guide

Setup pgadmin on docker through the command:
```
docker run --name pgadmin --network=postgres-network -p 5555:80 -e "PGADMIN_DEFAULT_EMAIL=example" -e "PGADMIN_DEFAULT_PASSWORD=password" -d dpage/pgadmin4
```

Build Postgres image with `init.sql`
```
docker build -t pgshard_v0 .
docker run --name pgshard1 -p 5432:5432 -e POSTGRES_PASSWORD="password" pgshard_v0
docker run --name pgshard2 -p 5433:5432 -e POSTGRES_PASSWORD="password" pgshard_v0
```

Access pgadmin on `localhost:5555` and create servers with the containers created above! (You might need to use `docker inspect` to get the `IPAdress`)

Go to `urlshortenerapp` directory, build and run the container:
```
docker build -t urlshort:0 .
docker run --name urlshortapp -p 8081:8081 urlshort:0
```

## TO do
- Connect everything through `docker-compose`
- Understand why Postgres containers are not on `localhost` and assigned ports