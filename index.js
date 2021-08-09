const express       = require('./node_modules/express');
const bodyParser    = require('./node_modules/body-parser');
const KRONOS        = require('./core/core');
const routes        = require('./routes');
KRONOS.baseProjPath = __dirname;

const appPort = KRONOS.getConfig().appPort;
const app = express();

app.use( bodyParser.json() );
app.use( '/api', routes );

// This api is for testing purpose only to populate global postman evironment variable
// remove after use
app.use( '/getValidUserCheckFlag', ( req, res ) =>
{
    res.status( 200 ).json({ IsUserValidationRequired: KRONOS.getConfig().IsUserValidationRequired });
});

app.use( '/', ( req, res ) =>
{
    res.status( 400 ).json({ Error: `Bad Request: ${ req.path } is not a valid request` });
});

app.listen( appPort, () =>
{
    KRONOS.getLogger().debug( `Listening to port ${appPort}` );
});