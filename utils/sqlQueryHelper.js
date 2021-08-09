module.exports = function createSQLQueryPromise( dbConn, sql, param = null )
{
    return new Promise(( resolve, reject ) =>
    {
        dbConn.query( sql, param, function ( error, results, fields )
        {
            if( error )
            {
                reject( error );
            }
            else
            {
                resolve( results );
            }
        });
    })
};