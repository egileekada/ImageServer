const express = require('express');
const router = express.Router();
const upload = require("../controllers/upload")
const update = require("../controllers/update") 
const remove = require("../controllers/delete")  

const controller = require('../controllers/get.image.controller');

router.get('/viewall', controller.viewall); 
router.get('/search', controller.search); 
router.post('/view_image', controller.view_image); 

router.use("/image", upload, remove, update);   

module.exports = router;