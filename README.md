# Turnazos storage service

This is turnazos storage service. Servers as a cloud file storage.

## How to get started

If you are going to work only with this service, you have to create a .env file and pass the variables listed [in here](https://github.com/Turnazos/user_service/tree/main/src/config/env.ts) and run `yarn run dev`.

## Persists logs in docker

To persists logs in docker, pass a volume to `/data/storage`

example in docker file:

```yml
volumes:
    storage_data:

name: turnazos
services:
    logger:
        image: ghcr.io/turnazos/storage:latest
        volumes:
            - storage_data:/data/storage
        env_file:
            - ./.env
        ports:
            - 5000:5000
```
