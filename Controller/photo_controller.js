const express = require("express");  
const router = express.Router();  
const upload = require("../Routers/upload")
const update = require("../Routers/update") 
const remove = require("../Routers/delete")  
const database = require('../Database/database')  
const assert = require('assert');

const client = database.connect  

async function findImageByName(client, name, res){ 

    // client.connect( async function(err) {  
    //     if(err) return err
    //     const db = client.db("Photo_Storage");
    //     db.collection("data").find({ name: { $regex: name, $options:'i' } }).toArray(function(err, docs) {
    //         assert.equal(err, null); 
    //         res.json(docs)   
    //       }); 
    // })
 
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
    // finally {
    //     client.close();
    // }
}); 

router.get("/search", async (req, res)=>{ 

    // let name = req.query.name 
    // client.connect( async function(err) {  
    //     if(err) return err
    //     const db = client.db("Photo_Storage");
    //     db.collection("data").find({ name: { $regex: name, $options:'i' } }).toArray(function(err, docs) {
    //         assert.equal(err, null); 
    //         res.json(docs)   
    //       }); 
    // })
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
    // client.connect( async function(err) {  
    //     if(err) return err
    //     const db = client.db("Photo_Storage");
    //     db.collection("data").find().toArray(function(err, docs) {
    //         assert.equal(err, null); 
    //         res.json(docs)   
    //       }); 

    // }) 
    try {      
        const cursor = client.db("Photo_Storage").collection("data").find();

        const results = await cursor.toArray(); 
        res.json(results)   
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
    // finally {
    //     client.close();
    // }
});  

module.exports = router;