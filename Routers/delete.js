const express = require("express"); 
const router = express.Router();  
const {MongoClient} = require("mongodb"); 

require('dotenv').config();
const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}, { connectTimeoutMS: 300 }, { keepAlive: 1});
  
router.post("/delete", async (req, res)=>{ 
    try {     

        await client.connect(); 
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