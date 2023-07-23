
## Description

API to calculate the current stock level based on the stock(stock.json) and transaction data given (transactions.json)

The static files(stock.json and transactions.json) are in the folder src/data-store.

An error will occur when starting the server if either of the files is missing or if their contents are not in the correct JSON format.

**Prerequisites of the application (Either of the below 2)**
1. Node.js version >=16.0.0 | <=18.16.0
2. Docker

## Installation
```bash
$ npm install
```
- Create `.env` file in root folder and Copy `.example.env` file content to it and then update the env values (Optional)

## Running the Server

```bash
# development
$ npm run start:dev

# production
$ npm run build
$ npm run start:prod
```
You can also use Docker to run the project

```bash
# Build docker container
$ docker build -t stock-calculator .

# production
$ docker run -it -p 3000:3000 stock-calculator
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Run the API to get the current stock level

Go to browser and run : http://localhost:3000/inventory/?sku=SXV420098/71/68

Also, Try it with different inputs like :

http://localhost:3000/inventory?sku=SXV420398/71/6

http://localhost:3000/inventory
