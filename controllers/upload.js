const { cloudinary } = require('../utils/cloudinary'); 
const express = require("express"); 
const router = express.Router();   
const data = require('../model/data') 

async function AddImageData(client, newData){  
    // await client.db("Photo_Storage").collection("data", {
    //     validator: {
    //         $and: [
    //             {
    //                 "name" : {$type: "string", $exists: true}
    //             },
    //             {
    //                 "url" : {$type: "string", $exists: true}
    //             },
    //         ]
    //     }
    // }).insertOne(newData); 

    await data.save(newData); 
    
    await client
        .db("Photo_Storage")
        .collection("data")
        .createIndex({name: 1}, {unique: true});

    console.log("Upload Successful") 
}  
 
router.post("/upload", async (req, res)=>{ 
    try {  
        const {name,url } = req.body.data
        // const fileStr = req.body.data.url; 
        const uploadResponse = await cloudinary.uploader.upload(url, { 
            "folder" : 'Michael Images',
            upload_preset: 'o8imcxn2' 
        });   

        const newurl = uploadResponse.secure_url

        const newItem = new data({
            name, 
            newurl
        });
        const itemInfo = await newItem.save();
        itemInfo.success = true;
        res.status(201).json(itemInfo);

        // data.name = req.body.data.name 
        // data. = uploadResponse. 
        // await data.save();  

        res.json({ msg: 'yaya' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

module.exports = router;