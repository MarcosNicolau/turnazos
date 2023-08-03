# Local deployment

## How to get started developing locally

1. Clone the repo: <br />
   `git clone https://github.com/Turnazos/deployment_infrastructure.git`
2. Generate the CLI program: <br />
   `make`
3. Setup the services: <br />
   `turnazos local setup`
4. Explore the tool:
   `turnazos --help`

That is it, you are all set, you should be running all the services that any other microservice would require. You can start working on your service!!

### A thing to note

The `turnazos local setup` command will do what `turnazos local up` and also will chown the docker-compose generated volumes to the respective user of the image.

So, you should only run `turnazos local setup` the first time you create the services or when you delete the volumes. After that, use `turnazos local up`

## An annotation when using databases locally

If you are developing multiple services locally, in the case that they use the same database technology, then you should not instantiate a database per service. Just instantiate one and create a db per service inside of it.

For example, let's say two containers use Postgres as their databases. Instead of instantiating two Postgres containers you just create one and then you pass the same connection string to the services but you change the database field. A connection string of postgres looks like this: `postgresql://<user>:<password>@localhost:5432/<database>`

### Another note

This pattern should not only be done with databases but with any other technology where a similar situation occurs.
