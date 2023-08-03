# TurnosYa infrastructure

This markup contains the infrastructure, technology and development of TurnosYa back end.

# Microservices

TurnosYa will be built on microservices. We have created a graph with the services and connections. [Click here to see](https://drive.google.com/file/d/1g1ivYg9Eaau2vUYbqsUn9PZu8RKazyEB/view?usp=sharing)

This is the list of services:

-   Authentication
-   Users
-   Turnos
-   Business
-   Notification
-   Chatting
-   Server checks
-   Services job runner

The communcation between services will be through a message broker, RabbitMQ.

We really want to have a separation of concerns and make sure that each service is completely independant from others. That is why each service will own a database (if needed) that won't be accesible to any other service, only through RPC communication.

For example, if the turnos service needs to get a particular business data, it will have to make an RPC through RabbitMQ to the business service, since its only service that can access that information.

For now, all service will be built with nodejs, and we will use postgres with redis most of the time for the database.

## API Gateway

Each server call will first go a proxy server. This server will handle authentication, rate limiting and other stuff. You can think of it as a request manager.

If the authentication success, it will proxy the request based on the path.

## Authentication Service

The authentication will be made using JWT tokens. Basically, the user will request a token with their credentials and we will return an `access_token` and `refresh_token`. The access token will expiry in 15 minutes. After that time the user will have to refresh the token which lasts for 30 days.

### Token rotation

When the user uses the refresh token, we will also create a new refresh token, invalidating the old one. This is called token rotation. We are going to keep track of the last generated token and **if a request with the old refresh token is made, we will inmediately revoke all tokens access**.

This is for security concerns, because someone might have stolen the refresh token but we don't know wich one the hacker has so we just invalidate them all.

### 2FA code

Of course when requesting a new pair of tokens, we are going to send an OTP code (via email or whatsapp) for better security.

### Database

All refresh tokens and the history `will be stored in **REDIS**

### Logout

When the user logs auth we will delete the refresh token and blacklist the access token.

### Block access

For blocking access we will create a user_id blocked list. If the user with that id tries to create a new token or if the token information inside has that id we will return 401.

## Authorization

The authorization is done by each service. For that, the proxy will attach the JWT token in the headers, so that if a service required admin_access we will can the authorization.

## User service

The User service is going to be a web server.

### Create user

User sign up will be done with Mobile. The reason is beacuse this is mainly going to be a mobile app and we don't want to have a lot of accounts. After the user submits the register we will create a request for an OTP to the entered number. To finish the register we will send a query with all the data introduce plus the OTP code. In the server we will check that the OTP belonging to that number is correct and if it is register the user.

## Business service

This service will hold the user businesses profile, each user can create any number of them.

The main components the profile is composed of are:

-   General stuff, such as name, small description, address, etc,
-   A profile image and a portrait image
-   Any other Image the owner might want to upload, useful to create a gallery
-   User ratings (only user who have gone to the place will be able to rate)
-   Provided services and its costs
-   Accepted payment

Note that many of these fields are optional.

## File storage service

This service will be a storage. It will be built using multer (nodejs). Other services will communicate through http. Basically, one uploads a file and the service generates a url to retrieve it.

Here will go all the images for the users and business and all the busines documention for verification.

In the future, it might be a good idea to use a service like awsS3, but for now we are going to stick with this to keep low costs.

## Turnos service

This service will handle all the logic of the business appointments.

It will handle the business available hours and appointments previously set by the owner.

And then it will also handle all the consumer part where he sets up an appointment.

It will also, in case the owner wants to cancel or re-arrange some of the appointments, provide endpoints to make that task easier for the client.

The owner can cancel an appointment or cancel a day of work, and the application offers a way to automatically re-schedule the appointments.

Off course, the service will notify both the user and owner of the bushiness if anything happens

## Notification service

This service will only consume events. Based on the event type it will send app notifications or whatsapp notifications.

Whatsapp notifications will be mostly used for OTP codes. Unless the user configures the account to receive important notification like turnos through whatsapp. We are going to use Whatsapp business API for this.

## Chatting service

This service will have a REST API and a WebSocket with socket.io.

## Job runner service

This service will run all the background jobs needed for any service. It will consume events to schedual new jobs and run any concurrent job.

We will use Agenda for this which we will connect to a mongo database.

## Server checks service

This service will be for metrics, logging, healt check, prometheus, grafana, etc.

For the logging part. The server will consume different events to separate the type of logs, if its a failure, info, etc, and will log them. This is to have a centralized logger where we can debug all the services.

---

# Tech to use

Now, lets list the tech we are going to use for each problem.

-   Code Sharing: Bit
-   Dependencies update automation: Dependabot
-   ORM: Prisma
-   Testing: Mocha
-   Message broker: RabbitMQ.
-   REST Framework: express.
-   Websocket: Socket.io
-   Language: TypeScript.
-   Enviroment: NodeJs
