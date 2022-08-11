
const Products = require('../models/productController');
const slutify = require('slugify');

class apiRequest{
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }


    paginating(){
        const limit = this.queryString.limit * 1 || 12;
        const page = this.queryString.page * 1 || 1;
        const skip = (page - 1) * limit;
        this.query = this.query.limit(limit).skip(skip);
        return this;
    }

    sorting(){
        const sort = this.queryString.sort || '-createdAt';
        this.query = this.query.sort(sort);
        return this;
    }

    searching(){
        const search = this.queryString.search;
        if(search){
            this.query = this.query.find({
                $text:{
                    $search:search
                }
            })
        }
        else{
            this.query = this.query.find();
        }
        return this;
    }

    filtering(){
        const excludes = ['page','limit','page','search'];
        const strObj = {...this.queryString};


        excludes.forEach(item => {
            delete strObj[item];
        });

        var objStr = JSON.stringify(strObj);

        objStr = objStr.replace(/\b(gte|gt|lte|lt|regex)\b/g,el => '$' + el);

        this.query = this.query.find(JSON.parse(objStr));

        return this;
    }
}

class productController{
    async getProduct(req,res){
        try{
            const api = new apiRequest(Products.find().populate({
                path:"chapter",
                select:"title content"
            })
            ,req.query).paginating().sorting().filtering().searching();
            const product = await api.query;
            const count = await Products.count(api.query.limit(null).skip(null));
            res.status(200).json({Products:product,count});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async createProduct(req,res){
        try{
            const {title,image1,image2,kinds,content,status} = req.body;
            const searchingTitle = slutify(title,'-');
            const Product = new Products({title,image1,image2,kinds,content,status,searchingTitle:searchingTitle});
            await Product.save();
            return res.status(200).json({msg:`Tạo thành công ${title}`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateProduct(req,res){
        try{
            const {title,image1,image2,kinds,content,status} = req.body;
            const product = await Products.find({slug:req.params.slug});
            if(!product){
                return res.status(400).json({msg:"Truyện này không tồn tại."});
            }
            await Products.findOneAndUpdate({slug:req.params.slug},{title,image1,image2,kinds,content,status});
            return res.status(200).json({msg:"Cập nhật thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteProduct(req,res){
        try{
            const {title} = req.body;
            if(title !== 'Minhquang265'){
                return res.status(400).json({msg:"Bạn không thể xóa."});
            }
            const product = await Products.findOne({slug:req.params.slug});
            if(!product){
                return res.status(400).json({msg:"Truyện này không hề tồn tại."});
            }
            await Products.findByIdAndDelete(product._id);
            return res.status(200).json({msg:`Xóa thành công ${product.title}`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async getDefaultProduct(req,res){
        try{
            const products = await Products.find().limit(req.body.limit);
            const topProducts = await Products.find().sort('like').limit(3);
            const outStandingProducts = await Products.find().sort('watching').limit(9);
            return res.status(200).json({products,topProducts,outStandingProducts});
        }catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async getOne(req,res){
        try{
            const product = await Products.findOne({slug:req.params.slug}).populate({
                path:'chapter',
                select:'title content watching createdAt'
            });
            if(!product){
                return res.status(400).json({msg:"Không tồn tại."});
            }
            return res.status(200).json({product});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new productController;