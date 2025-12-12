const express = require('express');
const session = require('express-session');
const MemCachedStore = require('connect-memcached');
const { backend1Port } = require('./config');
const { secret } = require('./secret');

const store = new (MemCachedStore(session))({
  hosts: ['localhost'],
  secret,
});

const sessionConfig = {
  name: 'try-issue',
  secret,
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  }
};

const app = express();

app.use(session(sessionConfig));

app.get('/', (req, res) => {
  if (!req.session.cpt) {
    req.session.cpt = 0;
  }

  req.session.cpt += 1;

  res.send(`Hello World! (${req.session.cpt})
SessionId: ${req.session.id}`);
});

// Export the encrypted cookie as plain text
app.get('/export', (req, res) => {
  res.send('');
});

app.listen(backend1Port, () => {
  console.log(`backend1 listening on port ${backend1Port}`);
});
