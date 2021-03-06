const { cloudinary } = require('../utils/cloudinary'); 
const express = require("express"); 
const router = express.Router();   
const data = require('../model/data') 

async function upadateImageByName(imageName, updateName){  
    await data.updateOne(
        { name: imageName },
        { $set:updateName }
    ); 
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
        await upadateImageByName(req.body.data.name , items);

        res.json({ msg: 'yaya' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}) 

module.exports = router;