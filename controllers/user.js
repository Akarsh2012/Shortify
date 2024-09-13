const User=require('../models/user');
const {getUser,setUser}=require('../service/auth');
const {v4: uuidv4}=require('uuid');




async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;

  try {
    // Attempt to create a new user
    const newUser= await User.create({
      name,
      email,
      password,
    });

    // Redirect on successful signup
    res.clearCookie('token');
    const token=setUser(newUser);
    res.cookie('token',token);
    return res.redirect('/');
  } catch (error) {
    // Prepare error message based on the error type
    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (error.name === 'ValidationError') {
      errorMessage = error.message; // Detailed validation error
    } else if (error.code === 11000) {
      errorMessage = 'Email already exists!'; // Duplicate email error
    }

    // Render the signup page with the error message
    return res.status(400).render('signup', { error: errorMessage });
  }
}


async function handleUserLogin(req,res) {
     const {email,password}=req.body;
     const user=await User.findOne({email,password});
     if(!user )
     {
        return res.render('login',{error:"Invalid username or password"});
     }
     
     const token=setUser(user);
     res.cookie('token',token);
    return res.redirect('/');
    
}

module.exports={
    handleUserSignUp,
    handleUserLogin,

}