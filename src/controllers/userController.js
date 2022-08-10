const Users = require('../models/userController');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

class userController{
    async login(req,res){
        try{
            const {token,userId} = req.body;
            const product = await fetch(`https://graph.facebook.com/${userId}?fields=id,name,email,picture&access_token=${token}`);
            const data = await product.json();

            const user = await Users.findOne({email:data.email});
            if(!user){
                return res.status(400).json({msg:'Xin lỗi.'});
            }
            const accessToken = getAccessToken(user);
            return res.status(200).json({accessToken,msg:"Đăng Nhập Thành Công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }

    async register(req,res){
        try{
            const {token,userId} = req.body;
            const product = await fetch(`https://graph.facebook.com/${userId}?fields=id,name,email,picture&access_token=${token}`);
            const data = await product.json();

            const user = new Users({
                email:data.email,
                password:data.id,
                rule:'admin'
            });
            await user.save();
            return res.status(200).json({msg:"Đăng Ký Thành Công."});
        }
        catch(err){
            return res.status(500).json({msg:err.message});
        }
    }
}

function getAccessToken(user){
    return jwt.sign({id:user._id},process.env.ACCESSTOKEN,{
        expiresIn:'3d'
    })
}

module.exports = new userController;