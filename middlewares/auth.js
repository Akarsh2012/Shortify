const { getUser } = require("../service/auth");

function checkForAuthentication(req,res,next){       
    const tokenCokie = req.cookies?.token;
    req.user=null;
    if(!tokenCokie)  
     return next();
    
     const token = tokenCokie;
     const user=getUser(token);
     req.user=user;
     return next();
}

//admin
function restrictTo(roles)
{
    return function(req,res,next){
        if(!req.user ) return res.redirect('/login');
        if( !roles.includes(req.user.role)) return res.render('home',{message:"Unauthorized Role"});
        return next();
    };

}



module.exports = {
  checkForAuthentication,
  restrictTo,
};
