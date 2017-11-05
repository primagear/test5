var mongoose = require('mongoose');

//加载定义的Schema文件
var userSchema = require('../schemas/userdata.js');

module.exports = mongoose.model('userdata', userSchema);