const { cloudinary } = require('../utils/cloudinary'); 
const express = require("express"); 
const router = express.Router();  
const database = require('../Database/database') 


const client = database.connect 

async function upadateImageByName(client, imageName, updateName){ 
    client.connect( async function(err) {  
        if(err) return err
        const db = client.db("Photo_Storage");
        db.collection("data").updateOne( { name: imageName }, { $set:updateName } ) 
    })
    // const cursor =  await client.db("Photo_Storage").collection("data").updateOne(
    //     { name: imageName },
    //     { $set:updateName }
    // );
     
    // console.log("File found "+cursor.matchedCount);
    // console.log("File have been updated "+cursor.modifiedCount);
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