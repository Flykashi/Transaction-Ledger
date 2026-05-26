const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")



const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required for registration"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "invalid email format"],
            unique:[true,"email already exists"]
    },
    name:{
        type:String,
        required:[true,"name is required for registration"]
    },
    password:{
        type:String,
        required:[true,"password is required for registration"],
        minlength:[6,"password must be at least 6 characters long"],
        select:false
    }
}, {
    timestamps:true
})
    userSchema.pre("save",async function(next){
        if(!this.isModified("password")){
            return next()
        }
        const hash = await bcrypt.hash(this.password,10)
        this.password = hash
        return
    })
    userSchema.methods.comparePassword = async function(password){
        return await bcrypt.compare(password,this.password)
    }
    const userModel = mongoose.model("User",userSchema)
    module.exports = userModel


