

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


Add bulk data to the elasticsearch instance if desired

curl -X POST -H 'Content-Type: application/json' --data-binary @sample-movies.bulk localhost:9200/_bulk


*** Free book https://www.starburst.io/info/oreilly-trino-guide/
