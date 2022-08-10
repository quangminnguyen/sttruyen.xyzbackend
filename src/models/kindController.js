const mongoose = require('mongoose');
const schema = mongoose.Schema;


const kindSchema = new schema({
    name:{
        type:String
    },
    slug:{
        type:String
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Kinds',kindSchema);