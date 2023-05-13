const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./db/Database.js");

// Handling unCaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught Exception`);
});

// connecting .env  config to server
dotenv.config({
  path: "backend/config/.env",
});

// connect database
connectDatabase();


// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on https://localhost${process.env.PORT}`);
});



// Unhandled promise rejection
// checking for invalid database url

process.on("unhandledRejection", (err) => {
  console.log(`shutting down server for ${err.message}`);
  console.log(`shutting down server due to Unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
