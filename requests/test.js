const http = require('http');

const url = "http://localhost:5001";
const numOfIterations = 10;

for (let index = 1; index <= numOfIterations; index++) {
  http.get(`${url}/${index}`, (res) => {
    let data = [];

    res.on('data', chunk => {
      data.push(chunk);
    });

    res.on('end', () => {
      const payload = Buffer.concat(data).toString();

      console.log(payload);
    });
  });
}