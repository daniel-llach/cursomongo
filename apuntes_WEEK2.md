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
