# Graph Ql Apollo Server with JWT Auth

## What is it?

It test server, where you can create account and create books. Base functions:

- Auth ( use JWT )
    - Register
    - Login
- Author
    - Remove account
- Book
    - Create
    - Edit ( title and status )
    - Delete

This project get me many knowledge about GraphQl, Docker, MongoDB and JWT.
I have studied many articles about JWT tokens - and understand what need JWT, where it use
and how it can to realize. Articles about MongoDB + Docker, how it settings and how it
use. Articles and docs about GraphQl Apollo (Base technology of this project).

## What for I use JWT

I wanted create something new. Of course, if need create prod application
for monolith architecture, jwt is not the best solution. For microservices - good.
This project without microservices.

But if would project use microservices - I use graphql, and JWT loses main advantages (As it seems to me).

I use JWT with refresh token. I create token, save it in database and every time, when
user send request updating tokens (access and refresh), class Auth verify token from
cookie and in db. If has error on ever step - we don't update tokens and
send auth error to user.

I spent much time on this system, I did it for the first time. I thinking about best
method of auth user. "JWT with refresh token, without localstorage" - I think it
interesting.

## What for I use Graph Ql Apollo

For test. But I didn't like it. I don't see advantages this technology for many
projects. It's so hard technology for simple project, REST API has problems too, but I
like it more than Graph QL.

Graph QL has many problems with optimization database requests, caching on frontend
and store data on frontend. Work with apollo cache - it more difficult than Redux.

## What for I use docker with mongo

For test too :)
I like docker and I sped 1 days for settings docker with mongo and setup.js (create
new user, database). I was very happy when I set everything up. I had fun.
Mongo for me - it is best solution. For prod (real app) - has questions.

## What for I stopped develop it?

I want to check something other. This project I create for test. I wanted to understanding
what is GraphQl, how it work, problems with this technology and best place for it.
I got answers, and now I will not use it for my projects. REST API I like more :)

Maybe, when I have more free time, I will try again. But now I need to study 
frontend. Examine React with Redux. Next.js. Maybe React Native.

:)