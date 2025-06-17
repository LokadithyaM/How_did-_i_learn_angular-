const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


const DBuser = process.env.DB_USER;
const DBPassoword = process.env.DBPassoword;
const DBName = process.env.DB_NAME;

console.log(`DB User: ${DBuser}`);
console.log(`DB Password: ${DBPassoword}`);
console.log(`DB Name: ${DBName}`);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    console.log(`Database User: ${DBuser}`);
});
