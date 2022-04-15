var mongoose = require('mongoose');
var schema = mongoose.Schema;

var remarkSchema = new schema({
    title : String,
    author: String ,
    likes :{type : Number , default:0},
    eventID :{type :schema.Types.ObjectId ,ref :'Events'}
},{timestamps :true})

var Remark = mongoose.model('Remark' , remarkSchema) 
module.exports = Remark;