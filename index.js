const express = require('express')  
const application = express()
const path = require("path")
const expressHandlerbars = require("express-handlebars")
const bodyparser = require("body-parser") 
// const PhotoController = require("./Controller/photo_controller")  
const Router = require("./routes/image.route")  
var cors = require('cors');
const mongoose = require('mongoose'); 
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

// application.use("/api", PhotoController)
application.use("/api", Router)

const port = process.env.PORT || 8000
 
try {
  mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
  }, () => console.log('Connected to DB'));
} catch (error) {
  console.log(`connection failed!! ${error}`)
}

application.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})