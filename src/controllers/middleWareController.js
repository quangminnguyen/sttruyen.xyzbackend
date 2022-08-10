const Users = require('../models/userController');
const jwt = require('jsonwebtoken');

class middleWareController{

    async verifyAdmin(req,res,next){
        try{
            const token = req.headers.token;

            if(!token){
                return res.status(400).json({msg:'Vui lòng đăng con nhà bà nhập.'});
            }
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken,process.env.ACCESSTOKEN,async (err,infor) => {
                if(err){
                    return res.status(400).json({msg:'Vui lòng đăng con nhà bà nhập.'});
                }
                const user = await Users.findById(infor.id);
                if(!user){
                    return res.status(400).json({msg:'Giỏi đấy nhưng bye.'});
                }
                if(user.rule !== 'admin'){
                    return res.status(400).json({msg:"You're not admin ok."});
                }
                req.user = user;
                next();
            })

        }
        catch(err){
            return res.status(500).json({msg:err.message}); 
        }
    }
}

module.exports = new middleWareController;