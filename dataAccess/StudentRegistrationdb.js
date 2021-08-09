const sqlQueryPromise = require( '../utils/sqlQueryHelper.js' );

function studentRegistrationDBAccess ( dbConnection )
{
    function register( studentsToRegister )
    {
        return sqlQueryPromise( dbConnection, `INSERT INTO StudentRegistration SET ?`, studentsToRegister );
    }

    function getStudentsForTeacherId( teachers )
    {
        let sqlQueryConstructor =  `SELECT * FROM StudentRegistration WHERE `;
        for( let x = 0; x < teachers.length; x++ )
        {
            sqlQueryConstructor += `TeacherEmail='${ teachers[x] }'`;
            sqlQueryConstructor += ( x == teachers.length -1 ) ? '' : ' OR '
        }
        console.log( sqlQueryConstructor, teachers );
        return sqlQueryPromise( dbConnection, sqlQueryConstructor, teachers );
    }

    function getAllRegisteredStudents()
    {
        return sqlQueryPromise( dbConnection, 'SELECT * FROM StudentRegistration' )
    }


    function deleteAllRegisteredStudents()
    {
        return sqlQueryPromise( dbConnection, 'DELETE FROM StudentRegistration' )
    }

    return Object.freeze(
    {
        register,
        getStudentsForTeacherId,
        deleteAllRegisteredStudents,
        getAllRegisteredStudents
    });
};

module.exports = studentRegistrationDBAccess;