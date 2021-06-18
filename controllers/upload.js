const { cloudinary } = require('../utils/cloudinary'); 
const express = require("express"); 
const router = express.Router();   
const data = require('../model/data') 
 
router.post("/upload", async (req, res)=>{ 
    try {   
        const fileStr = req.body.data.url; 
        const uploadResponse = await cloudinary.uploader.upload(fileStr, { 
            "folder" : 'Michael Images',
            upload_preset: 'o8imcxn2' 
        });   
 
        // let store = new data();
        // store.name = req.body.data.name;
        // store.url = uploadResponse.secure_url

        var obj = {
            name:req.body.data.name,
            url:uploadResponse.secure_url
        }
          
        data.create(obj, (err, item) => {
            if (err) {
                console.log(err);
            }
            else {
                item.save(); 
            }
        }); 

        res.json({ msg: 'yaya' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

module.exports = router;