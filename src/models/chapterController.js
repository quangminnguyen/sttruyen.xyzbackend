const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const chapterSchema = new schema({
    title:{
        type:String
    },
    content:{
        type:String
    },
    movie:{
        type:String
    },
    watching:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});


module.exports = mongoose.model('Chapters',chapterSchema);
