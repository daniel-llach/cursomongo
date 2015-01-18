## Week 2: CRUD

### Querying Using $gt and $lt

En colección *people* busca nombres que comiencen con letras desde la B hasta la D. 
*$gte = grater than equal* *$lte = lower than equal* 

```
db.people.find( { name: {  $gte : "B", $lte : "D" } } )
```

### Using regexes, $exists, $type

Busca dentro de *people* aquellos registros que contengan el campo *profession*
```
 db.people.find({ profession : { $exists : true } });
```

Busca en *people* aquellos que su campo *name* sea del typo *string* (2)
```
db.people.find({ name : { $type: 2 } });
```

Write a query that retrieves documents from a users collection where the name has a "q" in it, and the document has an email field:
```
db.users.find({ name: { $regex : "q" }, email : { $exists : true } })
```

### Using $or

Busca *people* que cuyo *name* termine con *e* **o** que tenga el campo *age*
```
db.people.find( { $or : [ { name : { $regex : "e$"} }, { age : { $exists : true } } ] } );
```

How would you find all documents in the scores collection where the score is less than 50 or greater than 90?

Note: We're afraid that the parser has trouble recognizing when you switch the order, so be sure to put your "less than" operator before your "greater than" one.
```
db.scores.find({ $or : [ { score : { $lt : 50 }}, { score : { $gt : 90 } } ] });
```

### Using $and

Busca en *people* que tenga *name* mayor que *C* **y** que contenga el string *a*
```
db.people.find( { $and : [ { name : { $gt : "C" }}, { name : { $regex : "a" }}]} );
```

la query anterior es igual a:
```
db.people.find( { name : { $gt : "C", $regex : "a" } } );
```

Lo que hace la siguinet query es primero trae los *score* mas grandes que 50, pero luego busca los menores a 60.. la segunda opcion reemplaza la primera
```
db.scores.find( { score : { $gt : 50 }, score : { $lt : 60 } } );
```
asi si traeria los *score* entre 50 y 60:
```
db.scores.find( { $and : [ { score : { $gt : 50 } }, { score : { $lt : 60 } } ] } );
```

## Querying Inside Arrays

tomando en cuenta la colecion *accounts* que contiene un array dentro del campo *favorites*

```
> db.accounts.find().pretty()
{
        "_id" : ObjectId("54bac6762ab59b100a36aba1"),
        "name" : "George",
        "favorites" : [
                "ice cream",
                "pretzels"
        ]
}
{
        "_id" : ObjectId("54bac6a02ab59b100a36aba2"),
        "name" : "Howard",
        "favorites" : [
                "pretzels",
                "beer"
        ]
}
```

Al hacer la siguiente query:
```
db.accounts.find( { favorites : "pretzels" } );
```

Entrega el resultado de ambos elementos, puesto que mongodb realiza busquedas polimorficas dentro de los arrays.

Por cierto que se puede combinar con otro tipo de busquedas como este ejemplo:
```
db.accounts.find( { favorites : "pretzels", name : { $gt : "H" } } );
```

## Using $in and $all

Para hacer busquedas de un campo que coincidan con varios elementos de un array se puede utilizar *$all* de la siguiente manera:
```
db.accounts.find( { favorites : { $all : ["pretzels", "beer"] }});
```

Para realizar una busqueda tipo array en vez de usar *$or* se puede usar *$in* de la siguiente manera:
```
db.accounts.find( { name : { $in : ["Howard", "John"] }});
```
Busca en collecion *users* en el campo *friends* que contenga "Joe" **y** "Bob" y que ademas en el campo *favorites* contenga "running" **o** "pickles"
```
db.users.find( { friends : { $all : [ "Joe" , "Bob" ] }, favorites : { $in : [ "running" , "pickles" ] } } )
```

## Queries with Dot Notation

Para buscar dentro de un *key* dentro de un *object* se puede usar dot notation.. ejemplo: name : "email.work" como se especifica en el siguiente ejemplo:
```
db.users.find({ "email.work" : "richard@10gen.com" })
```

suponiendo los siguientes datos:
```
{ product : "Super Duper-o-phonic", 
  price : 100000000000,
  reviews : [ { user : "fred", comment : "Great!" , rating : 5 },
              { user : "tom" , comment : "I agree with Fred, somewhat!" , rating : 4 } ],
  ... }
```
Write a query that finds all products that cost more than 10,000 and that have a rating of 5 or better.
```
db.catalog.find({ price: {$gt:10000}, "reviews.rating" : {$gte:5} });
```

## Querying, Cursors

Al realizar una query en el mongo shell se genera un cursor. Shell esta configurada para crear un cursor con el cual interactuar con los elementos del tree.
si se busca lo siguiente, la shell contruira un cursor que imprime lo solicitado
```
db.people.find()
```
si uno se puede colgar de un cursor, se puede colgar de cualquier otro valor en el lenguaje de programa. (para evitar imprimir el resultado se usa la variable *null;* )
```
cur = db.people.find(); null;
```
*cur* ahora es una variable de un objeto *cursor*.
*cur* tiene sus propios métodos.
```
cur.hasNext()
```
el metodo anterior habilita el comenado *next()* el cual permite visitar el proximo cursor en realacion al cursor actual
```
> cur.hasNext()
true
> cur.next()
{
        "_id" : ObjectId("54b583f02ab59b100a369fe0"),
        "name" : "Smith",
        "age" : 30,
        "profession" : "hacker"
}
> 
```
con esto se puede programar secuencias de acciones sobre el *cur* como en python.
```
while (cur.hasNext()) printjson(cur.next());
```
para crear el *cur* con los datos donde se desea realizar la query se debe definir nuevamente como se hizo al comienzo:
```
cur = db.people.find(); null;
```
se puede configurar limites para que muestre resultados cada un numero dado
```
cur.limit(5); null;
```
con la propiedad sort se puede elegir el orden de las query
```
cur.sort( { name : -1 } ); null;
```
se puede hacer todo lo anterior de una
```
> cur = db.people.find(); null;
null
> cur.sort( { name : -1 } ).limit(3); null
null
> while (cur.hasNext()) printjson(cur.next());
```
Write a query that retrieves exam documents, sorted by score in descending order, skipping the first 50 and showing only the next 20.
```
db.scores.find( { type : "exam" } ).sort( { score : -1 } ).skip(50).limit(20)
```

## Counting Results
```
db.scores.count({ type : "exam"})
```
How would you count the documents in the scores collection where the type was "essay" and the score was greater than 90?
```
db.scores.count({ type: "essay", score : { $gt : 90 } })
```

## Wholesale Updating of a Document

para *update* un registro se debe indicar primero una query del elemento a modifica y a continuación la o las variables a actualizar:
```
> db.people.update( { name : "Smith" }, { name : "Thompson" , salary : 5000 })
```
NO SE ACTUALIZAN LOS CAMPOS QUE NO SE DEFINEN !!!   en el caso anterior si el registro tuviese mas campos solo prevalece name y salary

## Using the $set Command

Cuando no se desea reemplazar a todos los del campo que se busca se utiliza *$set*
```
> db.people.update( { name : "Alice" }, { $set : { age : 30 } } )
```

Si se desea incrementar el valor en uno se puede usar *$inc*
```
> db.people.update( { name : "Alice" }, { $inc : { age : 1 } } )
```

## Using the $unset Command

eliminar un campo con *$unset*
```
> db.people.update( { name : "Jones" } , { $unset : { profession : 1 } } )
```

## Using $push, $pop, $pull, $pushAll, $pullAll, $addToSet

dada a siguiente *collection*
```
> db.arrays.insert( { _id : 0 , a : [ 1,2,3,4 ] } )
WriteResult({ "nInserted" : 1 })
> db.arrays.find()
{ "_id" : 0, "a" : [ 1, 2, 3, 4 ] }
> db.arrays.update( { _id : 0 } , { $set : { "a.2" : 5 } } )
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.arrays.find()
{ "_id" : 0, "a" : [ 1, 2, 5, 4 ] }
> 
```
agregar elemento en un array con *push* (se agrega al final)
```
> db.arrays.update( { _id : 0 } , { $push : { a : 6 } } )
```
elimina elemento de un array con *pop* (**1** elimina el ultimo y **-1** el primero)
```
> db.arrays.update( { _id : 0 } , { $pop : { a : 1 } } )
```
*push* de un array al final de un array
```
> db.arrays.update( { _id : 0 } , { $pushAll : { a : [ 7,8,9] } } )
```
*pull* elimina un elemento de cualquier lugar donde se encuentre
```
> db.arrays.update( { _id : 0 } , { $pull : { a : 5 } } )
```
*pullAll* elimina los elementos de un array en el array
```
> db.arrays.update( { _id : 0 } , { $pullAll : { a : [2, 4, 8] } } )
```
*addToSet* agrega un alemento al array sólo si este no existe
```
> db.arrays.update( { _id : 0 } , { $addToSet : { a : 5 } } )
```
*upsert* se usa cuando se desea agregar un campo nuevo si se desea actualizar y no existe
```
> db.people.update( { name : "George" } , { $set : { age : 40 } } , { upsert : true } )
```

## Multi-update
*multi : true* al configurarlo se puede operar con update en multiples elementos. 
En el siguiente caso cambia *title* (o agrega el campo si no existe) en todos los elementos ( **{}** )
```
> db.people.update( { } , { $set : { title : "Dr" } } , { multi : true} )
```


