const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'js', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.addToQueue = (message) => {
  messageQueue += message + '-';
}

module.exports.router = (req, res, next = ()=>{}) => {
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);
  switch (req.method) {

    case 'GET':

      var header = {};
      Object.assign(header, headers);
      if(req.url === '/background.jpg') {
        // If request was for background image that doesn't exist
        // res.writeHead(404, headers);
        var background = fs.createReadStream(module.exports.backgroundImageFile);
        background.on('open', function() {
          console.log('loading image')
          console.log(path.join('.','js', 'background.jpg'))
      //  res.setHeader('Content-Type', 'image/jpeg');
          background.pipe(res);
          Object.assign(header, {
            'Content-Type': 'image/jpeg'
          });
          res.writeHead(200, header);
        });
        background.on('error', function() {
          Object.assign(header, {
            'Content-Type': 'text/plain'
          });
          res.writeHead(404, header);
          res.end('Image not found');
        });
      } else {
        // Request is for moves
        res.writeHead(200, headers);
        res.write(messageQueue);
        res.end();
        messageQueue = '';
      }

      break;
    case 'OPTIONS':
      res.writeHead(200, headers);
      res.end();
      break;
  }

  next(); // invoke next() at the end of a request to help with testing!
};
