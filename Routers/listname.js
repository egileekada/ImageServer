const express = require("express"); 
const router = express.Router();   
const {MongoClient} = require("mongodb"); 

require('dotenv').config();
const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}, { connectTimeoutMS: 300 }, { keepAlive: 1});

router.get("/", async (req, res)=>{ 
    try {    
        
        await client.connect(); 
        const cursor = client.db("Photo_Storage").collection("data").find();

        const result = await cursor.toArray(); 
        res.json(result)
        console.log(result.name)
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 