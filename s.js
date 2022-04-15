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


async createIndex(indexName) {
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

async deleteIndex(indexName) {
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
    title: titles[numberInRange(19)];
    author: author[numberInRange(19)];  
    year: years[numberInRange(10)]; 
    content: content[numberInRange(50)]; 
    store: stores[numberInRange(50)]; 
  };
}

async function createBooks() {
  var indexName = 'books';
  createIndex(indexName);
  _.range(1,1000).forEach(id=> {
     var response = await client.index({
       id: id,
       index: indexName, 
       body: getBookDoc(), 
       refresh: true,
     });
  });	
}

async function createStores() {
  var indexName = 'stores';
  createIndex(indexName);
  _.range(1,50).forEach(id=> {
     var response = await client.index({
       id: id,
       index: indexName, 
       body: getBookDoc(), 
       refresh: true,
     });
  });	
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

//createStores();
createBooks();

// do sql
//deleteStores();
//deleteBooks();

deleteIndex('books');
