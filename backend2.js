const { createServer } = require('node:http');
const Kruptein = require('kruptein');
const  Memcached = require('memcached');
const { secret } = require('./secret');
const { backend2Port } = require('./config');

const sessionId = process.argv[2];

const kruptein = Kruptein({
  // algorithm: 'aes-256-gcm',
  hashing: 'sha512',
});

const server = createServer(async (request, response) => {
  const mem = new Memcached('localhost');

  const encryptedData = await new Promise((resolve, reject) => {
    mem.get(sessionId, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

  const decryptedData = await new Promise((resolve, reject) => {
    kruptein.get(secret, encryptedData, (err, ct) => {
      if (err) {
        reject(err);
        return;
      }

      if (!ct) {
        resolve(null);
        return;
      }

      resolve(ct);
    });
  });

  const session = JSON.parse(decryptedData);

  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(`Hello World! (${session.cpt})`);

  return response.end();
});

server.listen(backend2Port, () => {
  console.log(`backend2 listening on port ${backend2Port}`)
});

