/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const express = require('express');

// Config
const config = require('./config.json');

/* ---------------------------- Init HTTP server ---------------------------- */

const app = express();

/* ------------------------------- HTTP routes ------------------------------ */

app.get('/ping', (_req, res) => {
  res.send('Pong !');
});

/* ---------------------------- Starting servers ---------------------------- */

app.listen(config.server.port, () => console.log('Server listening on port', config.server.port));