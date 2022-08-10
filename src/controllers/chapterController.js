const Chapters = require('../models/chapterController');
const Products = require('../models/productController');

class chapterController{
    async createChapter(req,res){
        try{
            const { movie } = req.params;
            const {title,content} = req.body;
            if(!movie){
                return res.status(400).json({msg:'Bạn không thể làm thế ok.'});
            }
            const product = await Products.findOne({slug:movie});
            if(!product){
                return res.status(400).json({msg:"Truyện này không tồn tại."});
            }
            const chapter = new Chapters({title,content,movie});
            await chapter.save();
            product.chapter.push(chapter._id);
            await Products.findByIdAndUpdate(product._id,{chapter:product.chapter});
            return res.status(200).json({msg:"Tạo thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateChapter(req,res){
        try{
            const chapter = await Chapters.findById(req.params.id);
            if(!chapter){
                return res.status(400).json({msg:'Chương này không hề tồn tại.'});
            }
            const {title,content} = req.body;
            await Chapters.findByIdAndUpdate(chapter._id,{title,content});
            return res.status(200).json({msg:`Cật nhật thành công ${title}.`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteChapter(req,res){
        try{
            const chapter = await Chapters.findById(req.params.id);
            if(!chapter){
                return res.status(400).json({msg:'Chương này không hề tồn tại.'});
            }
            await Chapters.findByIdAndDelete(chapter._id);
            return res.status(200).json({msg:"Xóa thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new chapterController;