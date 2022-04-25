

To start 

docker-compose up -d

Add data to the elasticsearch instance

(load node js)

npm install 
node full_example.js

docker exec -it trino /bin/sh

vi /etc/trino/catalog/elasticsearch.properties

(Connector reference https://trino.io/docs/current/connector/elasticsearch.html)

add the following contents to the file

connector.name=elasticsearch
elasticsearch.host=localhost
elasticsearch.port=9200
elasticsearch.default-schema-name=default

save the file, exit the container

docker restart trino

docker exec -it trino /bin/sh

type trino

at the trino prompt

select books.author, books.store from elasticsearch.default.stores inner join elasticsearch.default.books on stores.store = books.store limit 10;


MYSQL JOIN

docker exec -it mysql /bin/sh

su - mysql

mysql -u root -p

Type example as the password

create database testdb;
create table stores (store varchar(200), description varchar(2000));

insert into stores (store, description) VALUES ('target','5%');

Log off and log back into trino

docker exec -it trino /bin/sh

Add the following to the file you will open below

connector.name=mysql
connection-url=jdbc:mysql://mysql:3306
connection-user=root
connection-password=example

vi /etc/trino/catalog/mysql.properties

log off the mysql container and restart trino

docker restart trino


Add bulk data to the elasticsearch instance if desired

curl -X POST -H 'Content-Type: application/json' --data-binary @sample-movies.bulk localhost:9200/_bulk


*** Free book https://www.starburst.io/info/oreilly-trino-guide/
