const express = require("express"); 
const router = express.Router();   
const database = require('../Database/database') 


const client = database.connect 

router.post("/delete", async (req, res)=>{ 
    try {      
        await client.db("Photo_Storage").collection("data").deleteOne(
            { name: req.body.data.name }
        );
        console.log("A File Named "+ req.body.data.name +" has been deleted") 
        res.json({ msg: 'yaya' });  
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 
 
module.exports = router;