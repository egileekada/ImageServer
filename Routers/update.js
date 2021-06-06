const { cloudinary } = require('../utils/cloudinary'); 
const express = require("express"); 
const router = express.Router();  
const {MongoClient} = require("mongodb");  

require('dotenv').config();

const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}, { connectTimeoutMS: 300 }, { keepAlive: 1}); 

async function upadateImageByName(client, imageName, updateName){ 

    await client.connect(); 
    const cursor =  await client.db("Photo_Storage").collection("data").updateOne(
        { name: imageName },
        { $set:updateName }
    );
     
    console.log("File found "+cursor.matchedCount);
    console.log("File have been updated "+cursor.modifiedCount);
}


router.post("/update", async (req, res)=>{ 
    try {
        const fileStr = req.body.data.url; 
        if(fileStr.substring(0, 4) === 'http'){
            var items = {  
                name : req.body.data.newname,
                url : fileStr
            } 
        } else {
            const uploadResponse = await cloudinary.uploader.upload(fileStr, { 
                "folder" : 'Michael Images',
                upload_preset: 'o8imcxn2' 
            });  
    
            var items = {  
                name : req.body.data.newname,
                url : uploadResponse.secure_url
            } 
        } 
        await upadateImageByName(client, req.body.data.name , items);

        res.json({ msg: 'yaya' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}) 

module.exports = router;