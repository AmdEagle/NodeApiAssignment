const sqlQueryPromise   = require( '../utils/sqlQueryHelper.js' );

function userDBAccess ( dbConnection )
{
    function getUsers()
    {
        return sqlQueryPromise( dbConnection, 'SELECT * FROM Users' );
    }

    function getUserByEmailId( emailId )
    {
        let emailIdArray = ( Array.isArray( emailId )) ? emailId : [emailId];
        let sqlQueryConstructor =  `SELECT * FROM Users WHERE `;
        for( let x = 0; x < emailIdArray.length; x++ )
        {
            sqlQueryConstructor += `Email='${ emailIdArray[x] }'`;
            sqlQueryConstructor += ( x == emailIdArray.length -1 ) ? '' : ' OR '
        }
        return sqlQueryPromise( dbConnection, sqlQueryConstructor );
    }

    function addUser( userObj )
    {
        return sqlQueryPromise( dbConnection, `INSERT INTO Users SET ?`, userObj );
    }

    return Object.freeze(
    {
        getUsers,
        getUserByEmailId,
        addUser
    });
};

module.exports = userDBAccess;