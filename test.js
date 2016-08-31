/**
 * Created by Administrator on 2016/8/30.
 */
var redis = require('redis');
var syncRequest = require('sync-request');
var startTime = new Date();
var token = 'sg8l3K1ApJUh_94Tq95YFDySp-M_NgHQKGtww7Zr3YM_h-mko8_Cyx_PzAz5ANOxq7N1Akr21rVfhFXKXZzG5Lc1hB_Zi4Vw5C7RuigVs9NiefrGY0OBZL2m3dYqJZLBCZTiAHAIFZ';
var MongoClent = require('mongodb').MongoClient;
MongoClent.connect('mongodb://192.168.100.2:27017/wechatUser',function (err,db) {
    var cursor = db.collection('openid1').find({'status':false});
    cursor.each(function (err,doc) {
        var timestarmp = new Date() - startTime;
        if (timestarmp>6900000){
            var tokenres = syncRequest('GET','https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3c1e9fdd84a88826&secret=73544f42698c7564deeff273e9ae0091');
            token = JSON.parse(tokenres.getBody().toString()).access_token;
        }
        var openid = doc.openid;
        var userres = syncRequest('GET','https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openid);
        var userInfo = JSON.parse(userres.getBody().toString());
        userInfo.subscribetime = new Date(parseInt(userInfo.subscribe_time)*1000).toLocaleString();
        userInfo.createtime = new Date().toLocaleString();
        userInfo.status = 'enable';
        console.log(userInfo);
        db.collection('userInfo').insertOne(userInfo,function (err,result) {
            console.log('insert one!');
            db.collection('openid1').updateOne(
                {openid : openid},
                {$set : {'status' : true}},
                function (err,rs) {
                    console.log('update success');
                }
            )
        })
    })
})