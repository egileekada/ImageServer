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
        const fileStr = req.body.data.url; 
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { 
            "folder" : 'Michael Images',
            upload_preset: 'o8imcxn2' 
        });  

        // const { item_name, item_description, item_category, reason } = req.body; //gets products data
        // if( item_name && item_description && item_category && reason ) {
        //     const newItem = new data({
        //         name,
        //         url, 
        //     });
        //     const itemInfo = await newItem.save();
        //     itemInfo.success = true;
        //     res.status(201).json(itemInfo);
        // } else {
        //     res.status(400).json({
        //         success: false,
        //         message: "new item could not be suggested"
        //     });
        // }
        const name = req.body.data.name;
        const url = uploadResponse.secure_url
        var items = new data({
            name,
            url
        });
        await items.save(); 

        res.json({ msg: 'yaya' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

module.exports = router;