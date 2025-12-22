const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');


const adminschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});


//  hash password before saving

adminschema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})
// compare password method
 
adminschema.methods.comparePassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password);
};

module.exports=mongoose.model("Admin",adminschema);