const { cloudinary } = require('../utils/cloudinary'); 
const express = require("express"); 
const router = express.Router(); 
const mongoose = require("mongoose")
const {MongoClient} = require("mongodb"); 

require('dotenv').config();
const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}, { connectTimeoutMS: 300 }, { keepAlive: 1});

async function AddImageData(client, newData){  
    await client.connect();
    await client.db("Photo_Storage").collection("data", {
        validator: {
            $and: [
                {
                    "name" : {$type: "string", $exists: true}
                },
                {
                    "url" : {$type: "string", $exists: true}
                },
            ]
        }
    }).insertOne(newData);

    await client
        .db("Photo_Storage")
        .collection("data")
        .createIndex({name: 1}, {unique: true});

    console.log("Upload Successful") 
} 
 
router.post("/upload", async (req, res)=>{ 
    try {  
        const fileStr = req.body.data.url; 
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { 
            "folder" : 'Michael Images',
            upload_preset: 'o8imcxn2' 
        });  

        var items = {
            name : req.body.data.name,
            url : uploadResponse.secure_url
        } 
        
        await AddImageData(client, items);  
        res.json({ msg: 'yaya' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

module.exports = router;