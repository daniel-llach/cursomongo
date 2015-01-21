## Homework 2.1

*headerline* permite al importar un *.csv* utilizar la primera linea como llaves
** el siguiente codigo se debe correr en la misma carpeta donde se encuentra el archivo .csv

```
mongoimport --type csv --headerline weather_data.csv -d weather -c data
```

## Homework 2.2

Buscar las temperaturas mas altas por estado y asignarle un nuevo campo llamado *"month_high":true*

```
'use strict';

var mongodb = require('mongodb'),
    db,
    currentState,
    cursorExhausted = false,
    updatesPending = 0;

mongodb.MongoClient.connect('mongodb://localhost:27017/weather', connect);

function connect (err, database) {
    db = database;
    db.collection('data').find().sort({"State":1,"Temperature":-1}).each(checkTemperature);
}

function checkTemperature (err, doc) {
    if(err) {
        console.log('Cursor error')
    }
    if(doc == null) {
        cursorExhausted = true;
    } else if(currentState == null || currentState != doc.State) {
        db.collection('data').update({"_id":doc._id},{"$set":{"month_high":true}}, function(err, updated){
           updatesPending--;
           if(err) {
               console.log('Doc update error:' + err);
           }
           if(cursorExhausted && updatesPending == 0) {
               return db.close();
           }
        });
        currentState = doc.State;
        updatesPending++;
    }
}

```
