/**
 * Created by Administrator on 2016/8/30.
 */
var redis = require('redis');
var syncRequest = require('sync-request');
var startTime = new Date();
var token = 'O8XPgQJYAR0M4cXiguEqlD3RzfFDaNiphHDRj_s2H7asy9ONxG2MkXMTTaHmG1Pz7VXYIaKwdOJ_vvL6HaJ7FcAHOcKP6z-aC6bsu1Sr71YgDliadRaH4r3bawSsFZgXMWQgAGAISM';
var MongoClent = require('mongodb').MongoClient;
MongoClent.connect('mongodb://192.168.100.2:27017/wechatUser',function (err,db) {
    var cursor = db.collection('openid1').find({'status':false});
    cursor.each(function (err,doc) {
        console.log(doc);
        var timestarmp = new Date() - startTime;
        if (timestarmp>6900000){
            startTime = new Date();
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