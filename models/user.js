const mongoose =require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
      email: {
    type: String,
    required: true,
    unique: true, // Optional: Ensures no duplicate emails
    lowercase: true, // Converts the email to lowercase
    validate: {
      validator: function (v) {
        // Regular expression to validate email format
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
    role:{
        type:String,
        required:true,
        default:"NORMAL",

    },
    password:{
        type:String,
        required:true,
    },

},{timestamps:true});


//model
const User=mongoose.model('user',userSchema);

module.exports=User;