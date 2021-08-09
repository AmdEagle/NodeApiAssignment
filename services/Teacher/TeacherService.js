const registry = require( '../../routes/routeRegistry.json' );

function TeacherController( KRONOS )
{
    async function retrievefornotifications( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            if( !req.body || !req.body.teacher )
            {
                resolve({ status: 400, data: `Bad Request: Teacher's email id was not received` });
                return;
            }

            let mentionedStudents = [];
            if( req.body.notification )
            {
                mentionedStudents = req.body.notification.split(' ').filter( x => x[0] == '@').map( x => x.replace( '@', '' ));
                KRONOS.getLogger().trace( 'Mentioned Students : ', mentionedStudents );
            }

            let serviceDataObj = registry.apiEndpoints[ "getSuspendedStudents" ];
            KRONOS.getLogger().debug( `Calling service internally to get suspended students` );
            KRONOS.getLogger().debug( `Routing to Service: ${ serviceDataObj.ServiceId } and Operation: ${ serviceDataObj.OperationId }` );
            let suspendedStudents = await KRONOS.ServiceManager[ serviceDataObj.ServiceId ][ serviceDataObj.OperationId ]().catch( err => reject( err ));
            KRONOS.getLogger().trace( `Suspended Students: `, suspendedStudents );
            suspendedStudents = suspendedStudents.data.map( x => x.StudentEmail );

            serviceDataObj = registry.apiEndpoints[ "commonstudents" ];
            let commonStudentReq = { query: { teacher : req.body.teacher }};
            KRONOS.getLogger().debug( `Calling service internally to get common students under teacher : ${ req.body.teacher }` );
            KRONOS.getLogger().debug( `Routing to Service: ${ serviceDataObj.ServiceId } and Operation: ${ serviceDataObj.OperationId }` );
            let commonStudents = await KRONOS.ServiceManager[ serviceDataObj.ServiceId ][ serviceDataObj.OperationId ]( commonStudentReq ).catch( err => reject( err ));
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
            resolve({ status: 200, data:{ recipients : notificationList }});
        });
    }

    return Object.freeze({
        retrievefornotifications
    });
};
module.exports = TeacherController;
