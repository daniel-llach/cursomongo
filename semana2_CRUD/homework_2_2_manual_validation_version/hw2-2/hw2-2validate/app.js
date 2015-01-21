var MongoClient = require('mongodb').MongoClient;
var currentState;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if(err) throw err;

    console.log('conectado');

    var data = db.collection('data');

    console.log(data);

    // var options = { 'sort' : [['State', 1], ['Temperature', -1]] };
    // var cursor = data.find({}, {}, options);

    // cursor.each(function(err, doc) {
    //     if(err) throw err;
    //     if(doc == null) {
    //         return db.close();
    //     }else if(currentState == null || currentState != doc.State){
    //         db.collection('data').update({"_id": doc._id}, {"$set":{"month_high":true}});
    //         currentState = doc.State;
    //     }
    // });
});
