const express = require("express"); 
const router = express.Router();  
const upload = require("../Routers/upload")
const update = require("../Routers/update")
const names = require("../Routers/listname")
const remove = require("../Routers/delete") 
const {MongoClient} = require("mongodb"); 

require('dotenv').config();
const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}, { connectTimeoutMS: 300 }, { keepAlive: 1});

async function findImageByName(client, name, res){ 

    await client.connect(); 
    const cursor = client.db("Photo_Storage").collection("data").find({
        name: { $regex: name, $options:'i' }
    });

    const result = await cursor.toArray(); 
    res.json(result)
}

router.use("/image", upload, remove, update);  


// router.use("/", names); 

router.post("/view_image", async (req, res)=>{ 
    try {   

        let name = req.body.data
        await findImageByName(client, name, res);  
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

router.get("/search", async (req, res)=>{ 
    try {   
        let name = req.query.name 
        await client.connect(); 
        const cursor = client.db("Photo_Storage").collection("data").find({
            name: { $regex: name, $options:'i' }
        });

        const result = await cursor.toArray(); 
        res.json(result)         
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

router.get("/viewall", async (req, res)=>{ 
    try {    
        
        await client.connect(); 
        const cursor = client.db("Photo_Storage").collection("data").find();

        const results = await cursor.toArray(); 
        res.json(results)  
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

module.exports = router;