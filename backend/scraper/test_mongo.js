require("dotenv").config();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = process.env.ATLAS_URI;
console.log(uri);

const document = {
    "year": 1950,
    "name": "Nino Farina",
    "totalPoints": "30",
    "results": {
        "BRI": {
            "place": "1*",
            "points": "9 Pts"
        },
        "MON": {
            "place": "DNF",
            "points": "Did not finish - Accident"
        },
        "INDY": {
            "place": "",
            "points": null
        },
        "SWI": {
            "place": "1*",
            "points": "9 Pts"
        },
        "BEL": {
            "place": "4*",
            "points": "4 Pts"
        },
        "FRE": {
            "place": "7",
            "points": ""
        },
        "ITA": {
            "place": "1",
            "points": "8 Pts"
        }
    }
}

async function main(){
    
    // const uri = 'mongodb+srv://admin:mongof1password@f1.tupsd.mongodb.net/test?retryWrites=true&w=majority';

    const client = new MongoClient(uri);

    try{
        await client.connect();
        // await listDatabases(client);
        // await createDocument(client, document);
        // await findDocument(client, 1950);
        // await updateDocument(client, "Nino Farina", "Kha Nguyen"); // has errors
        // await deleteDocument(client, "Nino Farina");
    }
    catch(e){
        console.log("error: " + e);
    }
    finally{
        await client.close();
    }
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createDocument(client, document){
    const result = await client.db("F1").collection("Testing").insertOne(document);
    // insertMany(documents); // Takes an an array of objects
    console.log("new document ID: " + result.insertedId);
}

async function findDocument(client, yearValue) {
    result = await client.db("F1").collection("Testing").findOne({ year: yearValue });
    /*
    Finds all instances
     .find({
         property1: {whatever},
         property2: {whatever}
     })
    */

    if (result) {
        console.log(result);
    } else {
        console.log(`No listings found with the name '${yearValue}'`);
    }
}

async function updateDocument(client, nameValue, newNameValue){
    result = await client.db("F1").collection("Testing").updateOne({name: nameValue}, {$set: newNameValue});

    console.log("amount found: " + result.matchedCount);
    console.log("amount updated: " + result.modifiedCount);
}

async function deleteDocument(client, nameValue) {
    result = await client.db("F1").collection("Testing").deleteOne({ name: nameValue });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

main().catch(console.error);
// console.log("print: " + process.env.ATLAS_URI);

// outputs F1, admin, local