const mysql     = require('../node_modules/mysql');
const CONFIG    = require( '../config.json' );
function coreDB( KRONOS )
{
    KRONOS.getLogger().debug(`CoreDB Initialized`);  
    function initDbConnection()
    {
        
        KRONOS.getLogger().debug( `Initializing MySQL Database connection to ${ CONFIG.Repository.host }` ); 
        const connection = mysql.createConnection(
        {
            host        : CONFIG.Repository.host,
            user        : CONFIG.Repository.user,
            password    : CONFIG.Repository.password,
            database    : CONFIG.Repository.database
        });
        
        connection.connect( err =>
        {
            if( err )
            {
                KRONOS.isDatabaseRunning = false;
                KRONOS.getLogger().error( 'Error connecting: ' + err.stack );
                return;
            }
            KRONOS.isDatabaseRunning = true;
            KRONOS.getLogger().trace( 'connected as id ' + connection.threadId );
            KRONOS.getLogger().debug( `Initializing MySQL Database connection to ${ CONFIG.Repository.host }: Completed` );    
        });
        return connection;
    }

    return Object.freeze({
        initDbConnection
    });
}
module.exports = coreDB;