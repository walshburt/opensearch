"use strict";

var host = "localhost";
var protocol = "http";
var port = 9200;
var auth = "admin:admin"; // For testing only. Don't store credentials in code.

var { Client } = require("@opensearch-project/opensearch");
var fs = require("fs");
var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
});

var randomWords = require('random-words');
var _ = require('lodash');
var titles = randomWords(20);
var content = randomWords({exactly:50, wordsPerString:100});
var author = randomWords(20);
var years = _.range(2010,2020)
var stores = randomWords(50);
var descriptions = randomWords({exactly:50, wordsPerString:5});


async function createIndex(indexName) {
 try {
  var index_name = indexName;
  var settings = {
    settings: {
      index: {
        number_of_shards: 4,
        number_of_replicas: 3,
      },
    },
  };
  var response = await client.indices.create({
      index: index_name,
      body: settings,
  });
 }
 catch(e) {
	console.log('create index ' + indexName + ' error ' + e);
 }
}

async function deleteIndex(indexName) {
  var response = await client.indices.delete({
    index: indexName,
  });
}

function numberInRange(top) {
   return Math.floor((Math.random() * top));
}

function getBookDoc() {
  // Add a document to the index.
  return {
    title: titles[numberInRange(19)],
    author: author[numberInRange(19)],  
    year: years[numberInRange(10)], 
    content: content[numberInRange(50)],
    store: stores[numberInRange(50)] 
  };
}

async function createBooks() {
  var indexName = 'books';
//  createIndex(indexName);
  for (const id in _.range(1,1000)) {
     var response = await client.index({
       id: id,
       index: indexName, 
       body: getBookDoc(), 
       refresh: true,
     });
  }
}	

async function createStores() {
  var indexName = 'stores';
//  createIndex(indexName);
  for (const id in _.range(1,50)) {
     var response = await client.index({
       id: id,
       index: indexName, 
       body : {"store": stores[numberInRange(50)]},
       refresh: true,
     });
  };	
}

async function deleteIndex(indexName) {
  var response = await client.indices.delete({
    index: indexName,
  });
}

async function deleteBooks() {
  deleteIndex('books');


  // Delete the document.
  var response = await client.delete({
    index: index_name2,
    id: id2,
  });

}

async function doSearch() {
  var { body }  = await client.transport.request({
    method: "POST",
    path: "_plugins/_sql",
    body: {
      query: "select * from books"
    }
  })
      //query: "select * from books inner join store on books.store = store.store"
  if (body && body.datarows) {
        //console.log("SECOND join " + JSON.stringify(body.datarows));
        console.log("SECOND join " + JSON.stringify(body.datarows.length));
/*
	body.datarows.forEach(x=> {
		console.log(x);
	});
*/
  }
  else {
        console.log("NO BODY 2 data");
  }
}


// do sql
//deleteStores();
//deleteBooks();

//deleteIndex('books');

createStores();
createBooks();
doSearch();
console.log("done");
