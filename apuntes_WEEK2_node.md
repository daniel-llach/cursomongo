## Node.js Driver: find, findOne, and cursors

* importar json a base de datos:
```
mongoimport -d course -c grades grades.json
```

find (en app.js) :
```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'grade' : 100 };

    db.collection('grades').find(query).toArray(function(err, docs) {
        if(err) throw err;

        console.dir(docs);

        db.close();
    });
});
```

findOne:
```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'grade' : 100 };

    db.collection('grades').findOne(query, function(err, doc) {
        if(err) throw err;

        console.dir(doc);

        db.close();
    });
});
```

find con cursor!
```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'grade' : 100 };

    var cursor = db.collection('grades').find(query);

    cursor.each(function(err, doc) {
        if(err) throw err;

        if(doc == null) {
            return db.close();
        }

        console.dir(doc.student + " got a good grade!");
    });
});
```

find con cursor y funcion callback separada:
```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) 
{
     if(err) throw err;

     var query = { 'grade' : 100};

     function callback(err, doc) {
          if(err) throw err;

          console.dir(doc);

          db.close();
     } 
     
     db.collection('grades').findOne(query, callback);
});
```

## Node.js Driver: Using Field Projection

De la base de datos *course* toma de la coleccion *grades* aquellos registros que tengan *grade 100*, muestra (*projection*) el campo *student* y oculta el campo *_id*.
Luego por cada uno de estos registros muestra en la consola estos campos y además escribe el campo *student* + got a good grade!

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'grade' : 100 };

    var projection = { 'student' : 1, '_id' : 0 };

    db.collection('grades').find(query, projection).toArray(function(err, docs) {
        if(err) throw err;

        docs.forEach(function (doc) {
            console.dir(doc);
            console.dir(doc.student + " got a good grade!");
        });

        db.close();
    });
});
```

## Node.js Driver: Using $gt and $lt

```
var query = { 'student' : 'Joe', 'grade' : { '$gt' : 80, '$lt' : 95 } };
```

## Importing Reddit

para importar un json desde una url y copielo en el local
```
curl http://www.reddit.com/r/technology/.json > reddit.json
```

App para insertar json en mongodb con modulos de *mongodb* y *require*
```
var MongoClient = require('mongodb').MongoClient
  , request = require('request');

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    request('http://www.reddit.com/r/technology/.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);

            var stories = obj.data.children.map(function (story) { return story.data; });

            db.collection('reddit').insert(stories, function (err, data) {
                    if(err) throw err;

                    console.dir(data);

                    db.close();
            });
        }
    });
});
```

para verificar la importacion:
```
> mongo
> use course
switched to db course
> db.reddit.find().pretty()
```

## Node.js Driver: Using $regex

*$regex* = regular expression
Esto quiere decir que busca cualquier lugar lugar donde se encuentre la expression regular, no debe coincidir de manera exacta
```
> db.reddit.find({ 'title' : { '$regex' : 'NSA' } });
> db.reddit.find({ 'title' : { '$regex' : 'NSA' } }, { 'title' : 1, '_id' : 0 });   // lo mismo pero mostrando sólo el campo title
```
Lo mismo usando modulo mongodb
```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'title' : { '$regex' : 'Microsoft' } };

    var projection = { 'title' : 1, '_id' : 0 };

    db.collection('reddit').find(query, projection).each(function(err, doc) {
        if(err) throw err;

        if(doc == null) {
            return db.close();
        }

        console.dir(doc.title);
    });
});

```

## Node.js Driver: Using Dot Notation



