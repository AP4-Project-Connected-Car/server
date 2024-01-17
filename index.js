/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');

// Config
const config = require('./config.json');

/* ---------------------------- Init HTTP server ---------------------------- */

const app = express();
app.use(bodyParser.json());

/* ------------------------------- HTTP routes ------------------------------ */

app.get('/ping', (_req, res) => {
  res.json({message: 'Pong !', httpCode: 200});
});

/* ---------------------------- Starting servers ---------------------------- */

app.listen(config.server.port, () => console.log('Server listening on port', config.server.port));