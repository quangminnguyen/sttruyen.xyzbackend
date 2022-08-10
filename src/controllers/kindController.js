const Kinds = require('../models/kindController');
const slugify = require('slugify');

class kindController{
    async createKind(req,res){
        try{
            const {name} = req.body;
            const slug = slugify(name,'-');
            const kind = new Kinds({name,slug});
            await kind.save();
            res.status(200).json({msg:`Tạo thành công ${name}`});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async deleteKind(req,res){
        try{
            const kind = await Kinds.findById(req.params.id);
            if(!kind){
                return res.status(400).json({msg:"Không tồn tại."});
            }
            await Kinds.findByIdAndDelete(req.params.id);
            return res.status(200).json({msg:"Xóa thành công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
    async getAll(req,res){
        try{
            const kind = await Kinds.find();
            res.status(200).json({kind});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    } 
    async getOne(req,res){
        try{
            const kind = await Kinds.findOne({slug:req.params.slug});
            res.status(200).json({kind});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

module.exports = new kindController;