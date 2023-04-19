# TrueNorth | LoanPro - Code Challenge
# Arithmetic Calculator REST API

This project implements a Web platform to provide a simple calculator functionality (addition, subtraction, multiplication, division, square root, and a random string generation) where each functionality will have a separate cost per request. Users will have a starting credit/balance. Each request will be deducted from the user’s balance. If the user’s balance isn’t enough to cover the request cost, the request shall be denied.

The Web application and its UI application should be live (on any platform of your choice). They should be ready to be configured and used locally for any other developer (having all instructions written for this purpose).

## Entities

### User
* id
* username (email)
* password
* status (active, inactive)

### Operation
* id
* type (addition, subtraction, multiplication, division, square_root, random_string)
* cost

### Record
* id
* operation_id
* user_id
* amount
* user_balance
* operation_response
* date


## Tech Stack

* Node.js
* PostgreSQL

## Technical Requirements

* Use third-party operation for random string https://www.random.org/clients
* All client-server interaction should be through RESTful API (versionated).
* Collection endpoints should be able to provide filters and pagination.
* Use a Bootstrap or Material Design library (CSS/Design Library) of your choice.
* Add automated tests such as Unit Test (whether for frontend or backend).
* Records should be soft-deleted only.

## Installation
1. Clone the repository
```sh
git clone https://github.com/Ellebkey/calculator-backend-ts.git
```
2. Install dependencies:
```sh
npm install
```

3. Install global dependencies:
```sh
npm install -g ts-node typescript gulp
```

4. Set environment (vars):

```Copy  `.env.example` and rename it as `.env`. Change the info with you local database.```

5. Run migrations
```
sequelize-cli db:seed:all
```
6. Start server (development):
```sh
# Start server
gulp default
```

6b. Lint:
```sh
# Lint code with ESLint
gulp tslint
```

## Files Structure
- src
  - config
  - controllers
  - middlewares
  - models
  - routes
  - validations
  - utils
- tests
