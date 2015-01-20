## Homework 2.1

*headerline* permite al importar un *.csv* utilizar la primera linea como llaves
** el siguiente codigo se debe correr en la misma carpeta donde se encuentra el archivo .csv

```
mongoimport --type csv --headerline weather_data.csv -d weather -c data
```
