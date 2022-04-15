var mongoose = require('mongoose');
var schema = mongoose.Schema;

var eventSchema = new schema({
    title : String,
    summary: String ,
    host : String,
    start_date :{type :Date} ,
    end_date :{type : Date} ,
    event_category : String ,
    location : String ,
    likes :{type : Number , default:0},
    remarkID :[{type :schema.Types.ObjectId ,ref : 'Remark'}]
},{timestamps :true})

var Events = mongoose.model('Events' , eventSchema) 
module.exports = Events;