# NodeJS API Assignment

## Documents
- ### Data Dictionary
    [Data dictionary](./Documents/DataDictionary/) is situated under the directory ./Documents/DataDictionary/
    The data dictionary contains table names, the field names and on the last sheet named "BasicTestDataSetUsedForTesting" is a set of basic data used for testing.

    There are a total of 3 tables.
    1. Users
    2. Student
    3. StudentRegistration

    Users tables is a table I created for the validation purposes. To check whether the entity being used is whether a teacher or a student. This validation can be configured under [config.json](./config.json) by setting the flag true for the property "IsUserValidationRequired"

- ### Test case document
    [API test case document](./Documents/TestCases/) is also uploaded into the folder ./Documents/TestCases/apiTestCases.xlsx. It contains all the test cases for the all the api required by the assignment.


## Environment Setup
- ### Database setup guide
    1. Create a database named University.
        
        
            mysql> CREATE DATABASE University;
    1. Create tables using the [University.sql](./ProjectBasicData/University.sql) provided under ./ProjectBasicData/

            mysql> USE University;
            mysql> source University.sql;
    1. Verify tables are created correctly by cross checking with data dictionary. Use the following command to show table schema.

            mysql> DESCRIBE Users;
            mysql> DESCRIBE Students;
            mysql> DESCRIBE StudentRegistration;
- ### Cloning the Project
    1. Git clone the project from repository     
    1. Open terminal/cmd navigate to project folder
    1. Run the following command into the terminal/cmd to download npm node packages
    1. `npm install`
    1. all node packages used are shown inside [package.json](./package.json)
- ### Configuration setup
    1. All project logs are piped to logs folder in the project directory
    1. Setup up the port on which you would like to run the server on. Default port : 3000.
        1. Open [config.json](./config.json)
        1. Set the port under the property `appPort`
    1. Setup database connection configuration.
        1. Open [config.json](./config.json)
        1. Under the Property `Repository`
            - host : IP Address of database machine
            - user : User account that can be used to connect to database
            - password : User account password
            - database : Database name
    1. If `IsUserValidationRequired` Users table has to be populated with the own custom data ( check data dictionary for table schema ) or load my basic data [Users.sql](./ProjectBasicData/Users.sql) located under ./ProjectBasicData/Users.sql. If to load [Users.sql](./ProjectBasicData/Users.sql) into Users table.
        
            mysql> source Users.sql
- ### Run unit test
    - To run the unit test do the following.
        1. Open terminal/cmd navigate to project folder
        1. Enter into the terminal/cmd
        1. `npm run test`
        1. Unit contains test for the following
            - model/Student
            - model/StudentRegistration
            - service/Student
            - service/StudentRegistration
        1. Only included unit test to show the different types of units
            - One with no depedency module
            - one with module dependency injection/override
- ### Starting server guide
    - To start up the server do the following.
        1. Open terminal/cmd navigate to project folder
        1. Enter into the terminal/cmd
        1. `npm run start` 
- ### Running postman collection test
    - All postman test collection json files are stored under the directory [ApiTesting](./ApiTesting)
    - Postman enironment variables are inside the file [LocalEnvironment.postman_environment](./ApiTesting/LocalEnvironment.postman_environment.json)
        1. Update the IP Address `"key":"HostIpAddress"`'s value
        1. Update the Post `"key":"HostPort"`'s value
    - To perform postman collection api testing do the following.
        1. Open a new ( As server is running on the current terminal ) terminal/cmd navigate to project folder
        1. Enter into the terminal/cmd
        1. `npm run apiTest`
    - After the postman collection api test are completed. Call the following api to delete all records from the `Student` and `StudentRegistration` tables.
        1. <span style="color:blue">GET</span> `/api/deleteAllRegisteredStudents`
        1. <span style="color:blue">GET</span> `/api/deleteAllStudents`
    
