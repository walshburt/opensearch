"use strict";

//https://www.npmjs.com/package/@opensearch-project/opensearch

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
  try {
     var response = await client.indices.delete({
       index: indexName,
     });
  }
  catch(e) {
	console.log('delete index ' + indexName + ' error ' + e);
  }
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
  try {
    var indexName = 'books';
    for (const id in _.range(1,100)) {
       var response = await client.index({
         id: id,
         index: indexName, 
         body: getBookDoc(), 
         refresh: true,
       });
    }
  }
  catch(e) {
	console.log('create books ' + e);
  }
}	

async function createStores() {
  try {
     var indexName = 'stores';
     for (const id in _.range(1,50)) {
        var response = await client.index({
          id: id,
          index: indexName, 
          body : {"store": stores[id-1], "description" : descriptions[id-1]},
          refresh: true,
        });
     };	
  }
  catch(e) {
	console.log('create stores exception ' + e);
  }
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

async function doSearchBooks() {
  try {
     console.log('doSearchBooks');
     var { body }  = await client.transport.request({
       method: "POST",
       path: "_plugins/_sql",
       body: {
         query: "select * from books" 
       }
     })

     if (body && body.datarows) {
        console.log('rows' + body.datarows.length);
        for (const item in body.datarows) {
	   console.log(body.datarows[item]);
	}
     }
     else {
        console.log("NO BODY 2 data");
     }
  }
  catch(e) {
	console.log('search error ' + e);
  }
}

async function doSearchStores() {
  try {
     console.log('doSearchStores');
     var { body }  = await client.transport.request({
       method: "POST",
       path: "_plugins/_sql",
       body: {
         query: "select * from stores" 
       }
     })
     if (body && body.datarows) {
        console.log('rows' + body.datarows.length);
        for (const item in body.datarows) {
	   console.log(body.datarows[item]);
	}
     }
     else {
        console.log("NO BODY 2 data");
     }
  }
  catch(e) {
	console.log('search error ' + e);
  }
}

async function deleteAll(indexName) {
  try {
      client.deleteByQuery({
        index: indexName,
        type: '_doc',
        body: {
          query: {
            match_all : {}
          }
        }
      })
  }
  catch(e) {
     console.log('deleteAll index ' + indexName + ' error ' + e);
  }
}

async function doSearch() {
  try {
//select content from books inner join stores on books.store = stores.store where match(content,"this is", operator="AND")
//select content from books inner join stores on books.store = stores.store 
//select content from books inner join stores on books.store = stores.store where content like '%this%is%'

     var { body }  = await client.transport.request({
       method: "POST",
       path: "_plugins/_sql",
       body: {
         query: "select content from books where match(content,\"graph truck\", operator=\"AND\")"
       }
     })
     if (body && body.datarows) {
	body.datarows.forEach(x=> {
	   console.log(x);
	});
     }
     else {
        console.log("NO BODY 2 data");
     }
  }
  catch(e) {
	console.log('search error ' + e);
  }
}


async function runit() {

   // do sql
   //deleteStores();
   //deleteBooks();

//   await deleteIndex('books');
 //  await deleteIndex('stores');

//await deleteAll('stores'); 
//await deleteAll('books'); 
//await doSearchStores();
//await deleteIndex('stores');
//await deleteIndex('books');


//await createIndex('books');
//await createIndex('stores');

//   await createStores();
 //  await createBooks();


  await doSearch();
  //await doSearchStores();
//  await doSearchBooks();
   console.log("done");
}

runit();


async function baseQuery() {
    // Search for the document.
    var query = {
        'query': {
            'match_all' : {}
        }
    }

    var response = await client.search({
        index: 'books',
        body: query
    })

    const fullArray = response?.body?.hits?.hits;
    for (const i in fullArray) { 
	console.log(fullArray[i]._source);
    }
}

//baseQuery();
