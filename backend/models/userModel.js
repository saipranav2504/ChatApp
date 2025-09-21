const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    }, 
    
    pic: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe2NF4WF4znbKZu3QoeOMuAh4Cz_K7EE0Ogg&s"
    }

},
    {
        timestamps:true,
    }
)
    userModel.methods.matchPassword = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    }

    userModel.pre('save', async function (next){
        if(!this.isModified("password")){
           return next()
        }

        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
    })

module.exports = mongoose.model("User",userModel)