const express = require("express"); 
const router = express.Router();  
const upload = require("../Routers/upload")
const update = require("../Routers/update") 
const remove = require("../Routers/delete")  
const database = require('../Database/database') 

const client = database.connect 

async function findImageByName(client, name, res){ 
 
    const cursor = client.db("Photo_Storage").collection("data").find({
        name: { $regex: name, $options:'i' }
    });

    const result = await cursor.toArray(); 
    res.json(result)
}

router.use("/image", upload, remove, update);   

router.post("/view_image", async (req, res)=>{ 
    try {    
        let name = req.body.data
        await findImageByName(client, name, res);  
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

router.get("/search", async (req, res)=>{ 
    try {   
        let name = req.query.name 
        await client.connect(); 
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

router.get("/viewall", async (req, res)=>{ 
    try {      
        const cursor = client.db("Photo_Storage").collection("data").find();

        const results = await cursor.toArray(); 
        res.json(results)  
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
});  

module.exports = router;