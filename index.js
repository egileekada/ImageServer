const express = require('express') 
const application = express()
const path = require("path")
const expressHandlerbars = require("express-handlebars")
const bodyparser = require("body-parser")
const PhotoController = require("./Controller/photo_controller") 
var cors = require('cors');
 
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

application.use("/api", PhotoController)

const port = process.env.PORT || 8000

application.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})