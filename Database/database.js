const {MongoClient} = require("mongodb");  

require('dotenv').config();
const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}, { connectTimeoutMS: 300 }, { keepAlive: 1});

    // async function main() { 
    //     try {
    //         await client.connect();  
    //     } catch (e) {
    //         console.log(e);
    //     }
    // } 
    
    module.exports = {
        connect: client  
    } 

    // main()
      