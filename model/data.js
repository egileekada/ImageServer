const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Users schema 
const data = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    }
},{ collection : 'data' });

module.exports = mongoose.model('data', data);