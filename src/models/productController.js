const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const productSchema = new schema({
    title:{
        type:String,
        required:true
    },
    searchingTitle:{
        type:String
    },
    image1:{
        type:String
    },
    image2:{
        type:String 
    },
    chapter:{
        type:[
            {
                type:mongoose.Types.ObjectId,ref:"Chapters"
            }
        ],
        default:[]
    },
    slug:{
        type:String,
        unique:true,
        slug:'title'
    },
    content:{
        type:String 
    },
    kinds:{
        type:Array,
        default:[]
    },
    rating:{
        type:Number,
        default:0
    },
    reviewer:{
        type:Number,
        default:0
    },
    like:{
        type:Number,
        default:0
    },
    watching:{
        type:Number,
        default:0
    },
    status:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});


productSchema.index({searchingTitle:'text'});
const productModel = mongoose.model('Products',productSchema);
productModel.createIndexes({searchingTitle:'text'});
module.exports = productModel;