# Logger service

This is the logging service of turnazos. The project is just starting out, soon we will publish the docs

## How to get started

If you are going to work only with this service, you have to create a .env file and pass the variables listed [in here](https://github.com/Turnazos/user_service/tree/main/src/config/env.ts) and run `yarn run dev`.

## Persists logs in docker

To persists logs in docker, pass a volume to `/var/log/turnazos_logger`

example in docker file:

```yml
volumes:
    logger_data:

name: turnazos
services:
    logger:
        image: ghcr.io/turnazos/logger:latest
        volumes:
            - logger_data:/var/log/turnazos_logger
        restart: always
        env_file:
            - ./.env
        ports:
            - 5000:5000
```

### Branches

| Branch  | Description                                                                               |
| ------- | ----------------------------------------------------------------------------------------- |
| main    | this is what running in prod, only merge when you want to trigger a new release           |
| beta    | the newest features and the future prod code. This code is what we see in staging servers |
| staging | all pr goes here                                                                          |
| hotifx  | a bugfix to fix the prod code                                                             |

### Committing code

We are Commitizen friendly, meaning that whenever you commit code your message will be linted. <break />
`yarn cm`: You should commit your code using this command. You will be prompt with instructions to write the perfect message.
For more information go here: https://github.com/commitizen/cz-cli
