# APUNTES SEMANA 3

## MongoDB Schema Design

Q: What's the single most important factor in designing your application schema within MongoDB?
R: Matching the data access patterns of your application.

Coincidencia de los patrones de acceso a los datos de su aplicación.

## Relational normalization

Metas de la normalizacion (en BD RELACIONALES!)
> 1.- Liberar la BD de modificaciones anómalas
> 2.- Minimizar el esfuerzo de rediseñar la BD cuando crezca
> 3.- Evite sesgo hacia cualquier patrón acceso especial

Mongo cubre todo lo anterior.

## Mongo Design for Blog 

P:¿Es válida la redundancia de datos?
R:NO, mongoDB redunda pero de una forma menos redundante.. al limite.. puesto que si un objeto tiene una llave distinta lo considera otro objeto por lo que no es redundante, pero 2 objetos puede tener llaves iguales con valores iguales

## Alternative Schema for Blog 

Muestra otro tipo de esquema más parecido a  un esquema de BD relacional, pero no me queda claro si es mejor.

## Living Without Transactions 

P: What does Living Without Constraints refer to?
R: Keeping your data consistent even though MongoDB lacks foreign key constraints

## Living Without Transactions 

1.- Restructurar para que todo ocurra en un solo documento y tomar ventaja de las operaciones atómicas
2.- (no entendi nada de lo que dice) implementar muchas solucinoes de software
3.- Tolerar un poco de inconsistencia!

## One to One Relations 

1.-Employee: resumen
2.-Bulding: floor plan
3.-patient: medical history

1.-Se puede "relacionar" con id uno de otro.. o incluir todo el objeto resumen en employee o al revés

criterios
1.- frecuencia de acceso
2.- Tamaño de los items  (máximo tamaño de una COLLECTION 16 megas!  ?)
3.- Atomicidad de los datos

P: What's a good reason you might want to keep two documents that are related to each other one-to-one in separate collections? Check all that apply.
R: Because the combined size of the documents would be larger than 16MB

## One to Many Relations 

Ciudad : persona(S)

*true linking*

```
// People
{
  name: "Dan",
  city: "Valpo",
}
.
.

// City
{
  _id: "Valpo",
  .
  .
}
```

*one to few*

```
// Post
{
  name: "ble",
  coments: [
    {
      title: "Ble"
    }
    .
    .
  ]
}
```

## Many to Many Relations 

1.- Books: authors
2.- students: teachers

*few to few*
```
// Books
_id: 12,
title: "El título"
authors: [27,43,4]
.
.

// Authors
_id: 27,
author_name: Juanito,
books: [12,2,31]
.
.
```

## Multikeys (indexes)











