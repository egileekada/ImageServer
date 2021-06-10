const express = require('express')  
const application = express()
const path = require("path")
const expressHandlerbars = require("express-handlebars")
const bodyparser = require("body-parser") 
const PhotoController = require("./Controller/photo_controller") 
var cors = require('cors');
var mongodb = require('mongodb');
require('dotenv').config();
 
application.use(express.json({ limit: '50mb' }));
application.use(express.urlencoded({ limit: '50mb', extended: true }));
application.use(cors()); 

application.use(bodyparser.urlencoded({
  extended : true
}));

application.set("views", path.join(__dirname, "/views/"))

application.engine("hbs", expressHandlerbars({
  extname : "hbs",
  defaultLayout : "mainlayout",
  layoutsDir : __dirname + "/views/layouts"
})); 

application.set("view engine", "hbs")

application.get("/", (req, res)=>{
  res.render("index", {})
})


mongodb.MongoClient.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, database) {
  if(err) return err; 
  
  module.exports = {
    connect: database
  }  

  application.get("/api/viewall",async (req, res)=>{  
    database.db("Photo_Storage").collection("data").find().toArray(function(err, docs) {
        // Print the documents returned 
        res.json(docs)    
    }); 
  });

  application.get("/api/search", async (req, res)=>{  
    try {   
        let name = req.query.name  
        const cursor = database.db("Photo_Storage").collection("data").find({
            name: { $regex: name, $options:'i' }
        });

        const result = await cursor.toArray(); 
        res.json(result)         
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }  
  }); 

  application.post("/api/view_image", async (req, res) => { 
    try {    
      let name = req.body.data
      database.db("Photo_Storage").collection("data").find({
          name: { $regex: name, $options:'i' }
      });
  
      const result = await cursor.toArray(); 
      res.json(result)
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }  
  }); 

  application.post("/api/upload", async (req, res)=>{ 
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
        
        // await AddImageData(client, items);  

        await database.db("Photo_Storage").collection("data", {
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
      }).insertOne(items); 
      
      await database
          .db("Photo_Storage")
          .collection("data")
          .createIndex({name: 1}, {unique: true});
  
      console.log("Upload Successful") 

        res.json({ msg: 'yaya' }); 
    } catch (err) { 
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
}); 

  application.post("/api/update", async (req, res)=>{ 
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
        // await upadateImageByName(client, req.body.data.name , items);
        await database.db("Photo_Storage").collection("data").updateOne(
            { name: req.body.data.name },
            { $set: items }
        );
        res.json({ msg: 'yaya' }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
  }) 

  application.post("/api/delete", async (req, res)=>{ 
    try {        
        await database.db("Photo_Storage").collection("data").deleteOne(
            { name: req.body.data.name }
        );
        console.log("A File Named "+ req.body.data.name +" has been deleted") 
        res.json({ msg: 'yaya' });  
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    } 
  }); 

  const port = process.env.PORT || 8000
  
  application.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
});