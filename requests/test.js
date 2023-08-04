const http = require('http');

const url = "http://localhost:5001";
let numOfStandardRequest = 1;
let numOfGarbageCollectionRequest = 1;
let numOfMemoryDumpRequest = 1;

async function go() {
  sendMemoryDumpRequest();
  await sleep(2000);

  for (let i = 0; i < 10; i++) {
    await runIteration();
  }
}

async function runIteration() {
  sendStandardRequest();
  await sleep(30000);
  sendGarbageCollectionRequest();
  await sleep(2000);
  sendMemoryDumpRequest();
}

function sendStandardRequest() {
  for (let i = 0; i <= 10; i++) {
    http.get(`${url}/standard/${numOfStandardRequest++}`, handleRequest);
  }
}

function sendGarbageCollectionRequest() {
  http.get(`${url}/garbage-collection/${numOfGarbageCollectionRequest++}`, handleRequest);
}

function sendMemoryDumpRequest() {
  http.get(`${url}/memory-dump/${numOfMemoryDumpRequest++}`, handleRequest);
}

async function handleRequest(res) {
  let body = '';
  res.setEncoding('utf-8');
  for await (const chunk of res) {
    body += chunk;
  }

  console.log(body);
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

go();
