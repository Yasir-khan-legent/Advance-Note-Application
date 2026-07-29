
import mongoose from 'mongoose'

const userschema = mongoose.Schema({
    title:{
type:String,
    },
     tag:{
    type:String,
    required: true,
 },
 note:{
    type:String,
    required: true,
 },
 status:{
    type:String,
    enum: ['pending','completed']
 },
 Createdby:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Users'
 },
 isprivate:{
    type: Boolean,
   default:true
 },
 likes:[{
   type:mongoose.Schema.Types.ObjectId,
   ref : 'Users'
 }],
  dislike:[{
   type:mongoose.Schema.Types.ObjectId,
   ref : 'Users'
 }]
 
})
const Notes = mongoose.model('Notes',userschema)

export default Notes;