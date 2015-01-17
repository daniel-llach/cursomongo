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

