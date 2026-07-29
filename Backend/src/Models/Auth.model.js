
import mongoose from 'mongoose'

const userschema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password: {
        type:String,
        required:true
    },
     savenotes:[{
       type:mongoose.Schema.Types.ObjectId,
       ref : 'Notes'
     }],
     refreshToken: [{
   token: {
      type: String,
      required: true
   }
}]
})
const Users = mongoose.model('Users',userschema)

export default Users;