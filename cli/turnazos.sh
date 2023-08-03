#!/usr/bin/bash

show_help() 
{
    echo "Usage: turnazos COMMAND OPTIONS"
    echo 
    echo "COMMANDS:"
    echo "local,     Interact with the local infrastructure."
    echo ""
    echo "Run [turnazos COMMAND help] for more information on a command"
}

show_local_help() 
{
    echo "Usage: turnazos local COMMAND"
    echo 
    echo "COMMANDS:"
    echo "up,        Start and run containers"
    echo "down,      Stop and remove containers"
    echo "setup,     Change the volumes permissions. Run this the first time you start the containers."
    echo "setup,     Pull the latest images."

}

if [ "$1" == "local" ]; then 
    if [ -z $2 ] || [ $2 == "help" ]; then 
        show_local_help
        exit 0
    fi
    DOCKER_COMPOSE_FILE=<DIR>/docker/docker-compose.local.yml
    if [ $2 == "up" ]; then
        docker-compose -f $DOCKER_COMPOSE_FILE up -d
        exit 0
    fi

    if [ $2 == "down" ]; then
        docker-compose -f $DOCKER_COMPOSE_FILE down
        exit 0
    fi
    
    if [ $2 == "setup" ]; then
        docker-compose -f $DOCKER_COMPOSE_FILE up -d
        sudo chown 999:999 -R  /var/lib/docker/volumes/turnazos_postgres_data/_data   
        sudo chown 1000:1000 -R  /var/lib/docker/volumes/turnazos_logger_data/_data   
        sudo chown 1000:1000 -R  /var/lib/docker/volumes/turnazos_storage_data/_data 
        exit 0
    fi

    if [ $2 == "pull" ]; then
        docker-compose -f $DOCKER_COMPOSE_FILE pull
        exit 0
    fi
fi

# If it did not match any action, show help
show_help