const jwt=require('jsonwebtoken');
const secret="Akarsh@2211"

// this function creates token 
function setUser(user)
{
    return jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role,
    },secret);
}

function getUser(token)
{
    if(!token) return null;
    try{
        return jwt.verify(token,secret);
    }
    catch(error)
    {
        return null;
    }
}

module.exports={
    setUser,
    getUser,
}