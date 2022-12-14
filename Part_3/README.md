# CLEAN architecture with MongoDB Test

This CLEAN architecture example includes a User CRUD and Auth Login by default, plus MongoDB support<br />
You have to install MongoDB locally and specify a test collection url in the (.env) file like how its written in the (.env.example)

# Current APIs

GET /api/v1/users&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Get All Users)<br />
GET /api/v1/users/:id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Get User by ID)<br />
POST /api/v1/users&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Add User)<br />
PATCH /api/v1/users/:id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Update User by ID)<br />
DELETE /api/v1/users/:id&nbsp;&nbsp;&nbsp;(Delete User by ID) (Requires Valid AccessToken)<br />

POST /api/v1/auth/login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Login User)<br />

## Add Blog post CRUD

You have to add blog_post CRUD to this CLEAN architecture (refer to end of README for how the architecture works)<br />
You have to add it in the same way the Users CRUD was made with validation using Joi

## Add User Blog Post

You have to add user_blog_post collection in mongoDB that links users and blog posts (many to many)<br />
It should have:
1) user_id
2) blog_post_id

Add user_blog_post while adding a blog_post and use the userId that is passed through the AccessToken (refer to line 148 in deleteUser in UserControllers for an example on how to access userId)

## Remove User Blog Posts when User is deleted

You have to remove all user_blog_post and blog_post when user is deleted

<br /><br />

# Node Clean Architecture

## Table of Contents
- [Node Clean Architecture](#node-clean-architecture)
  - [Table of Contents](#table-of-contents)
  - [Clean Architecture](#clean-architecture)
    - [Folder structure](#folder-structure)
    - [The Dependency Rule](#the-dependency-rule)

## Clean Architecture

![Cleab Architecture](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

### Folder structure

```
app 
 └ @types                           → Extended Typescript types
 └ lib                              → Application sources 
    └ application                   → Application services layer
       └ security                   → Security tools interfaces (ex: AccessTokenManager.js, to generate and decode OAuth access token)
       └ use_cases                  → Application business rules 
    └ domain                        → Enterprise core business layer such as domain model objects (Aggregates, Entities, Value Objects, Data Validation, Services) and repository interfaces
    └ infrastructure                → Frameworks, drivers and tools such as Database, the Web Framework, mailing/logging/glue code etc.
       └ config                     → Application configuration files, modules and services
          └ service-locator.ts      → Module that manage service implementations by environment
       └ orm                        → Database ORMs middleware (Sequelize for SQLite3 or PostgreSQL, Mongoose for MongoDB)
          └ mongoose                → Mongoose client and schemas
       └ repositories               → Implementation of domain repository interfaces
          └ mongoose                → Mongoose implementation of repositories
       └ security                   → Security tools implementations (ex: JwtAccessTokenManager)
       └ stos                       → Schema objects to Entity objects mapping
       └ webserver                  → ExpressJs Web server configuration (server, routes, plugins, etc.)
          └ routes-v1.ts            → ExpressJs main routing area
          └ server.ts               → ExpressJs server definition
    └ interfaces                    → Adapters and formatters for use cases and entities to external agency such as Database or the Web
       └ controllers                → ExpressJs route handlers
       └ middlewares                → ExpressJs middlewares
       └ routes                     → ExpressJs route definitions
       └ serializers                → Converter objects that transform inside objects (ex: Use Case request object) to outside objects (ex: HTTP request payload)
 └ node_modules (generated)         → NPM dependencies
 └ global.ts                        → Extended Typescript definitions
 └ index.ts                         → Main application entry point
```

### The Dependency Rule

>The overriding rule that makes this architecture work is The Dependency Rule. This rule says that source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. That includes, functions, classes. variables, or any other named software entity.

Extracted from https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html#the-dependency-rule
