const Chapter = require('../models/chapterController');
const Product = require('../models/productController');

class chapterController{
    async createChapter(req,res){
        try{
            const {title,content} = req.body;

            const product = await Product.findOne({slug:req.params.slug});
            if(!product){
                return res.status(400).json({msg:"Truyện này không hề tồn tại."});
            }

            const chapter = new Chapter({
                title,
                content,
                movie:product.slug
            });
            await chapter.save();
            product.chapter.push(chapter._id);
            await Product.findByIdAndUpdate(product._id,{
                chapter:product.chapter
            })
            res.status(200).json({msg:"Tạo thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async updateChapter(req,res){
        try{
            const chapter = await Chapter.findById(req.params.id);
            const {title,content} = req.body;
            if(!chapter){
                return res.status(400).json({msg:"Chương này không hề tồn tại."});
            }
            await Chapter.findByIdAndUpdate(chapter._id,{
                title,
                content
            });
            res.status(200).json({msg:"Cập nhật thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteChapter(req,res){
        try{
            const {title} = req.body;
            if(title !== 'Minhquang265'){
                return res.status(400).json({msg:'Xin lỗi.'});
            }
            const chapter = await Chapter.findById(req.params.id);
            if(!chapter){
                return res.status(400).json({msg:"Chương này không hề tồn tại."});
            }
            const product = await Product.findOne({slug:chapter.movie});
            if(!product){
                return res.status(400).json({msg:"Truyện này không hề tồn tại."});
            }
            product.chapter = product.chapter.filter(item => item.toString() !== chapter._id.toString());

            await Product.findByIdAndUpdate(product._id,{
                chapter:product.chapter
            });

            await Chapter.findByIdAndDelete(chapter._id);
            res.status(200).json({msg:"Xóa thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new chapterController;