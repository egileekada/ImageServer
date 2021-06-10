const {MongoClient} = require("mongodb");  

require('dotenv').config();
const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 5000, socketTimeoutMS: 5000} );

    async function main() { 
        try {
            await client.connect();  
        } catch (e) {
            console.log(e);
        }
    } 
    
    module.exports = {
        connect: client  
    } 

    main()
      