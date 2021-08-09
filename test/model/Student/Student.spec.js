const makeStudent = require( '../../../model/Student' );
var expect = require('chai').expect;

describe("Student Model Unit Tests", () =>
{
    it('Verify that a valid student obj is created when passing in a valid Input', async () =>
    {
        let validStudentInputObj = 
        {
            StudentEmail    : "randomstudent@gmail.com",
            IsSuspended     : true
        };
        let suspendedStudent = await makeStudent( validStudentInputObj );
        expect( suspendedStudent.StudentEmail ).to.equal( validStudentInputObj.StudentEmail );
        expect( suspendedStudent.IsSuspended ).to.equal( validStudentInputObj.IsSuspended );
        expect( new Date( suspendedStudent.SuspendedOn ).getTime() > 0 ).to.equal( true );
    })

    it('Verify that an error is thrown when a non valid email is passed in', async () =>
    {
        let validStudentInputObj = 
        {
            StudentEmail    : "randomstudent",
            IsSuspended     : true
        };
        await makeStudent( validStudentInputObj ).catch( err => 
        {
            expect( err.message  ).to.equal( `ValidationError: "StudentEmail" must be a valid email` );
        });
    })

    it('Verify that a error is thrown when no student email is provided', async () =>
    {
        let validStudentInputObj = 
        {
            IsSuspended     : true
        };
        await makeStudent( validStudentInputObj ).catch( err => 
        {
            expect( err.message  ).to.equal( `ValidationError: "StudentEmail" is required` );
        });
    })

    it('Verify that a SuspendedOn value is null when IsSuspended is false', async () =>
    {
        let validStudentInputObj = 
        {
            StudentEmail    : "randomstudent@gmail.com",
            IsSuspended     : false
        };
        let suspendedStudent = await makeStudent( validStudentInputObj );
        expect( suspendedStudent.StudentEmail ).to.equal( validStudentInputObj.StudentEmail );
        expect( suspendedStudent.IsSuspended ).to.equal( validStudentInputObj.IsSuspended );
        expect( suspendedStudent.SuspendedOn ).to.equal( null );
    })

    it('Verify that a error is thrown when no object is passed as input', async () =>
    {
        await makeStudent().catch( err => 
        {
            expect( err.message  ).to.equal( `ValidationError: "StudentEmail" is required` );
        });
    })
});