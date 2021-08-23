function TeacherController( KRONOS )
{
    async function retrievefornotifications( req )
    {
        if( !req.body || !req.body.teacher )
        {
            return { status: 400, data: `Bad Request: Teacher's email id was not received` };
        }

        let mentionedStudents = [];
        if( req.body.notification )
        {
            mentionedStudents = req.body.notification.split(' ').filter( x => x[0] == '@').map( x => x.replace( '@', '' ));
            KRONOS.getLogger().trace( 'Mentioned Students : ', mentionedStudents );
        }

        KRONOS.getLogger().debug( `Calling service internally to get suspended students` );
        let suspendedStudents = await KRONOS.ServiceManager.apiCall("getSuspendedStudents")();
        KRONOS.getLogger().trace( `Suspended Students: `, suspendedStudents );
        suspendedStudents = suspendedStudents.data.map( x => x.StudentEmail );
        let commonStudentReq = { query: { teacher : req.body.teacher }};
        KRONOS.getLogger().debug( `Calling service internally to get common students under teacher : ${ req.body.teacher }` );
        let commonStudents = await KRONOS.ServiceManager.apiCall("commonstudents")( commonStudentReq );
        KRONOS.getLogger().trace( `Common Students: `, commonStudents );

        let notificationList = [];
        mentionedStudents.forEach( student =>
        {
            if( suspendedStudents.indexOf( student ) < 0 )
            {
                notificationList.push( student );
            }
        });
        commonStudents.data.students.forEach( student =>
        {
            if( suspendedStudents.indexOf( student ) < 0 && notificationList.indexOf( student ) < 0)
            {
                notificationList.push( student );
            }
        });
        return { status: 200, data:{ recipients : notificationList }};
    }

    return Object.freeze({
        retrievefornotifications
    });
};
module.exports = TeacherController;
