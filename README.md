# SIMON

### What is DDoS?

Distributed denial-of-service. The aim of DDoS is to overwhelm servers with more traffic than they can accommodate. The goal is to render the website or service inoperable by overloading.

### How can we prevent DDoS?

One natural way to prevent DDoS attacks is to rate-limit services. If one IP is agressively hitting our servers, our servers can simply deny service to that IP. Herein, I use two main technologies to demonstrate rate-limiting based on IP: Redis and Node.js w/ Express.

#### Redis

I use Redis as an in-memory storage for keeping track of the requestor's IP. If an IP is not found, we create a new record. On the other hand, if a record is found, the server calculates if the user is eligible to get a response. We can use a sliding window and calculate the # of requests made by the user during that window. If the # is greater than an arbitraryt threshold, we return a 429. Otherwise we return a 200 OK.

#### Node.js w/ Express

I use Node.js to create the API service that has a single endpoint: `/data`. Express is a Node.js compatible web application framework. I leverage the middleware capability of Express to create a rate limiting function that runs each time a `GET` request is made to our data endpoint.

## Running the app

If you have docker, simply run `docker-compose up` and visit `localhost:8080/data`. You can then run `docker-compose logs` to view std:out. You should view request counts.