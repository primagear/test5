var mongoose = require('mongoose');

//定义用户的表结构
module.exports = new mongoose.Schema({
    username: {type:String},
    password: {type:String},
    isAdmin: {
        type:Boolean,
        default:false
    }
});