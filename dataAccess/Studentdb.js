const sqlQueryPromise = require( '../utils/sqlQueryHelper.js' );

function studentDBAccess ( dbConnection )
{
    function suspend( studentsToSuspend )
    {
        let sqlQueryGen = `INSERT INTO Student(StudentEmail, IsSuspended, SuspendedOn ) `;
        sqlQueryGen += `VALUES ('${studentsToSuspend.StudentEmail}', ${studentsToSuspend.IsSuspended}, '${studentsToSuspend.SuspendedOn}') `;
        sqlQueryGen += `ON DUPLICATE KEY UPDATE IsSuspended=${studentsToSuspend.IsSuspended}, SuspendedOn='${studentsToSuspend.SuspendedOn}'`;
        return sqlQueryPromise( dbConnection, sqlQueryGen );
    }

    function getSuspendedStudents()
    {
        let sqlQueryConstructor = `SELECT StudentEmail FROM Student WHERE IsSuspended = true`
        return sqlQueryPromise( dbConnection, sqlQueryConstructor );
    }

    function deleteSuspendedStudents( studentsList )
    {
        let sqlQueryConstructor = `DELETE FROM Student WHERE StudentEmail= ?'`;
        return sqlQueryPromise( dbConnection, sqlQueryConstructor, studentsList );
    }

    function deleteAllStudents()
    {
        return sqlQueryPromise( dbConnection, `DELETE FROM Student` );
    }

    function getSuspendedStudentUnderTeacher( teacherEmail )
    {
        let sqlQueryConstructor = `SELECT SR.StudentEmail, S.IsSuspended FROM StudentRegistration AS SR 
        LEFT JOIN Student as S ON SR.StudentEmail=S.StudentEmail 
        WHERE S.IsSuspended = true AND SR.TeacherEmail='${ teacherEmail }'`
        return sqlQueryPromise( dbConnection, sqlQueryConstructor );
    }

    return Object.freeze(
    {
        suspend,
        getSuspendedStudents,
        getSuspendedStudentUnderTeacher,
        deleteSuspendedStudents,
        deleteAllStudents
    });
};

module.exports = studentDBAccess;