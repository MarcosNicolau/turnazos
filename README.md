# Turnazos storage service

This is turnazos storage service. Servers as a cloud file storage.

## How to get started

If you are going to work only with this service, you have to create a .env file and pass the variables listed [in here](https://github.com/Turnazos/user_service/tree/main/src/config/env.ts) and run `yarn run dev`.

## Persists data in docker

To persists the uploaded data to the storage in docker, pass a volume to `/data/storage`

example in docker-compose file:

```yml
volumes:
    storage_data:

name: turnazos
services:
    storage:
        image: ghcr.io/turnazos/storage:latest
        volumes:
            - storage_data:/data/storage
        env_file:
            - ./.env
        ports:
            - 5000:5000
```

### Important note on permissions

In the example, the storage_data will be created by docker-compose, thus it will be owned by root. The storage container runs with the user node, whose UID is 1000. So make sure you chown the volume like so: `sudo chown 1000:1000 -R <VOLUME_PATH>`.
