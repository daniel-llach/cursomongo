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

para referirse a campos anidados... ej: people.boy.age
```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'media.oembed.type' : 'video' };

    var projection = { 'media.oembed.url' : 1, '_id' : 0 };

    db.collection('reddit_front').find(query, projection).each(function(err, doc) {
        if(err) throw err;

        if(doc == null) {
            return db.close();
        }

        console.dir(doc);
    });
});
```
query que busca nombre de steve en la siguiente estructura:
```
{
    'course' : 'M101JS',
    'students' : [
        {
            'name' : 'Susan'
        },
        {
            'name' : 'Steve'
        }
    ]
}

{"students.name" : "Steve"}
```

## Node.js Driver: Skip, Limit and Sort
SORT SKIP LIMIT  // este es el orden

ordena por *grade* (number) de manera ascendente y por *student* (string) de manera decendente

* find( selector, projection, options) !

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var grades = db.collection('grades');

    var options = { 'skip' : 1,
                   'limit' : 4,
                   'sort' : [['grade', 1], ['student', -1]] };
    var cursor = grades.find({}, {}, options);

    cursor.each(function(err, doc) {
        if(err) throw err;
        if(doc == null) {
            return db.close();
        }
        console.dir(doc);
    });
});

```

## Node.js Driver: Inserting, _id

insertar sin ID
```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var doc = { 'student' : 'Calvin', 'age' : 6 };

    db.collection('students').insert(doc, function(err, inserted) {
        if(err) throw err;

        console.dir("Successfully inserted: " + JSON.stringify(inserted));

        return db.close();
    });
});

## Node.js Driver: Updating

Update single.
hace una query con un *findOne* de campo *assigment*  que toma la primera que coincide y toma su *_id* luego hace otra query de *update* que busca el *_id* especifico y este lo actualiza colocandole una nueva fecha (*new Date()*)

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'assignment' : 'hw1' };

    db.collection('grades').findOne(query, function(err, doc) {
        if(err) throw err;
        if(!doc) {
            console.log('No documents for assignment ' + query.assignment + ' found!');
            return db.close();
        }

        query['_id'] = doc['_id'];
        doc['date_returned'] = new Date();

        db.collection('grades').update(query, doc, function(err, updated) {
            if(err) throw err;

            console.dir("Successfully updated " + updated + " document!");

            return db.close();
        });
    });
});
```

*inplace*
en una sola query pregunta por *assignment*  y actualiza la fecha por medio de un $set

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'assignment' : 'hw1' };
    var operator = { '$set' : { 'date_returned' : new Date() } };

    db.collection('grades').update(query, operator, function(err, updated) {
        if(err) throw err;

        console.dir("Successfully updated " + updated + " document!");

        return db.close();
    });
});
```

*multi update*

busca en todos ( *{}* ) eliminar ( *$unset* ) y habilita la opcion multiple con ( *'multi' : true* )

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { };
    var operator = { '$unset' : { 'date_returned' : '' } };
    var options = { 'multi' : true };

    db.collection('grades').update(query, operator, options, function(err, updated) {
        if(err) throw err;

        console.dir("Successfully updated " + updated + " documents!");

        return db.close();
    });
});
```

## Node.js Driver: Upserts

Intenta reemplazar y si no existe inserta

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'estudent' : 'Frank', 'assignment' : 'hw1' };
    var operator = { 'estudent' : 'Frank', 'assignment' : 'hw1', 'grade' : 100 };
    // operator = { '$set' : {'date_returned' : new Date(), 'grade' : 100 } };   // otra manera con $set
    var options = { 'upsert' : true };

    db.collection('grades').update(query, operator, options, function(err, upserted) {
        if(err) throw err;

        console.dir("Successfully upserted " + upserted + " document!");

        return db.close();
    });
});
```

*save*
Hace lo mismo que el Upsert pero con menos codigo

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'assignment' : 'hw2' };

    db.collection('grades').findOne(query, function(err, doc) {
        if(err) throw err;

        doc['date_returned'] = new Date();

        db.collection('grades').save(doc, function(err, saved) {
            if(err) throw err;

            console.dir("Succesfully saved " + saved +  document!");

            return db.close();
        })
    });
});
```

## Node.js Driver: findAndModify

*Al usar *options = { 'new' : 'true' };* se generara un registro adicional si existe la query tiene aciertos.

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'name' : 'comments' };
    var sort = [];
    var operator = { '$inc' : { 'counter' : 1 } };
    var options = { 'new' : true };

    db.collection('counters').findAndModify(query, sort, operator, options, function(err, doc) {
        if(err) throw err;

        if (!doc) {
            console.log("No counter found for comments.");
        }
        else {
            console.log("Number of comments: " + doc.counter);
        }

        return db.close();
    });
});
```

## Node.js Driver: Remove

* *$nin* quiere decir *no in*... $nin : []  // esto es igual a todo

```
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/course', function(err, db) {
    if(err) throw err;

    var query = { 'assignment' : 'hw3' };

    db.collection('grades').remove(query, function(err, removed) {
        if(err) throw err;

        console.dir("Successfully updated " + removed + " documents!");

        return db.close();
    });
});
```

