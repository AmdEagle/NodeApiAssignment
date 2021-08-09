const makeStudentRegistration = require( '../../../model/StudentRegistration' );
var expect = require('chai').expect;

describe("StudentRegistration Model Unit Tests", () =>
{
    it('Verify that a valid student registration obj is created when passing in a valid Input', async () =>
    {
        let studentRegistrationInputObj = 
        {
            StudentEmail    : "randomstudent@gmail.com",
            TeacherEmail    : "randomteacher@gmail.com"
        };
        let studentRegistrationOutputObj = await makeStudentRegistration( studentRegistrationInputObj );
        expect( studentRegistrationOutputObj.StudentEmail ).to.equal( studentRegistrationInputObj.StudentEmail );
        expect( studentRegistrationOutputObj.TeacherEmail ).to.equal( studentRegistrationInputObj.TeacherEmail );
    })

    it('Verify that a valid student registration obj is created with invalid Student Email', async () =>
    {
        let studentRegistrationInputObj = 
        {
            StudentEmail    : "randomstudentgmail.com",
            TeacherEmail    : "randomteacher@gmail.com"
        };
        await makeStudentRegistration( studentRegistrationInputObj ).catch( err => 
        {
            expect( err.message  ).to.equal( `ValidationError: "StudentEmail" must be a valid email` );
        });
    })

    it('Verify that a valid student registration obj is created with invalid Teacher Email', async () =>
    {
        let studentRegistrationInputObj = 
        {
            StudentEmail    : "randomstudent@gmail.com",
            TeacherEmail    : "randomteachergmail.com"
        };
        await makeStudentRegistration( studentRegistrationInputObj ).catch( err => 
        {
            expect( err.message  ).to.equal( `ValidationError: "TeacherEmail" must be a valid email` );
        });
    })

    it('Verify that a valid student registration obj is created with missing StudentEmail property', async () =>
    {
        let studentRegistrationInputObj = 
        {
            TeacherEmail    : "randomteacher@gmail.com"
        };
        await makeStudentRegistration( studentRegistrationInputObj ).catch( err => 
        {
            expect( err.message  ).to.equal( `ValidationError: "StudentEmail" is required` );
        });
    })

    it('Verify that a valid student registration obj is created with invalid Teacher Email', async () =>
    {
        let studentRegistrationInputObj = 
        {
            StudentEmail    : "randomstudent@gmail.com"
        };
        await makeStudentRegistration( studentRegistrationInputObj ).catch( err => 
        {
            expect( err.message  ).to.equal( `ValidationError: "TeacherEmail" is required` );
        });
    })
});