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

criterio: frecuencia de acceso

