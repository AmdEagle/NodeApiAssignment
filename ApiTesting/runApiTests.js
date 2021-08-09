const newman = require('newman'); 

const relativePathToEnvironment = './LocalEnvironment.postman_environment.json';
const relativePathToCollections = "./PostmanCollections/";
let collectionsToRun = 
[
    "01-Register.postman_collection.json",
    "02-Common students api testing.postman_collection.json",
    "03-Suspend api testing.postman_collection.json",
    "04-Retrievefornotifications api testing.postman_collection.json"
];

function startSyncRun()
{
    let collection = collectionsToRun.shift();
    newman.run(
    {
        collection  : require( `${relativePathToCollections}${collection}` ),
        environment : require( relativePathToEnvironment ),
        reporters   : 'cli'
    }, function (err) 
    {
        if (err) { throw err; }
        if( collectionsToRun.length == 0 )
        {
            console.log( `All tests under run completed successfully` );
            console.log( `=========================================================` );
        }
        else
        {
            //console.log( `${ collectionsToRun.length } more to go.` );
            startSyncRun();
        }
    });
}
startSyncRun();