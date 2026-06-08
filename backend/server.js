const app = require("./app");
const connectDatabase = require("./db/Database");

//Hanndeling uncaught Exceptions
process.on("uncaughtException", (err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shuting down the server for handeling uncaught exxception`);
})

//config
if(process.env.NODE_ENV != "PRODUCTION"){
    require("dotenv").config({
        path:"backend/config/.env"
    })
};

//connect db
connectDatabase();

//create server
const server= app.listen(process.env.PORT, ()=>{
   console.log(
    `Server is running on http://localhost:${process.env.PORT}`
   );    
});


//unhandeled promise rejection
process.on("unhandledRejection", (err)=>{
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`Shutting down the server for unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    })
})