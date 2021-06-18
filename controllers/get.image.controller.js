const data = require('../model/data') 

exports.viewall = async(req, res) => {
    try { 
        const allItems = await data.find();
        if(allItems) {
            res.json(allItems);
            console.log('name '+allItems)
        } else {
            res.status(404).json({
                success: false,
                message: "item(s) not found"
            });
        }  
    } catch(error) {
        res.status(500).json(error);
    }
}

exports.search = async(req, res) => {
    try {  
        let name = req.query.name  
        const cursor = await data.find({
            name: { $regex: name, $options:'i' }
        }); 
        res.json(cursor)      
    } catch(error) {
        res.status(500).json(error);
    }
}

exports.view_image = async(req, res) => {
    try {   
        const cursor = await data.find({
            name: { $regex: req.body.data, $options:'i' }
        }); 
    
        res.json(cursor)     
    } catch(error) {
        res.status(500).json(error);
    }
}