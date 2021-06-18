const express = require("express");  
const router = express.Router();  
const upload = require("../Routers/upload")
const update = require("../Routers/update") 
const remove = require("../Routers/delete")  
const database = require('../Database/database')   
// const assert = require('assert');

// const client = database.connect   

const client = database.connect

async function findImageByName(client, name, res){  
    const cursor = await client.db("Photo_Storage").collection("data").find({
        name: { $regex: name, $options:'i' }
    });

    const result = await cursor.toArray(); 
    res.json(result)
}

router.use("/image", upload, remove, update);   

router.post("/view_image", async (req, res) => { 
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

router.get("/viewall",async (req, res)=>{    

    // client.db("Photo_Storage").collection("data").find().toArray(function(err, docs) {
    //     // Print the documents returned 
    //     res.json(docs)   
    // });

    try {      
        const cursor = client.db("Photo_Storage").collection("data").find();

        const results = await cursor.toArray(); 
        res.json(results)   
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }  
});  

module.exports = router;