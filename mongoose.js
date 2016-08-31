/**
 * Created by Administrator on 2016/8/31.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://102.100.2/wechatUser');
var db = mongoose.connection;

var Schema = mongoose.Schema;
var userinfoSchema = new Schema({
    subscribe : Int32,
    openid : String,
    nickname : String,
    sex : Int32,
    language :String,
    city : String,
    province :String,
    country : String,
    headimgurl : String,
    subscribe_time : Int32,
    remark : String,
    groupid : Int32,
    tagid_list : Array,
    status : String,
    createtime : String
})
var openidSchema = new Schema({
    openid : String
})
var openid = mongoose.model('openid',openidSchema);

var userInfo = mongoose.model('')