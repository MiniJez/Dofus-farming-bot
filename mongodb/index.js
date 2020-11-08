const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();


// Schema
const farmingMapRecordSchema = new Schema({
    mapPosition: {
        x: Number,
        y: Number
    },
    mapRecords: [{
        recordsType: String,
        records: [{
            x: Number,
            y: Number
        }]
    }]
});

const farmingPathRecordSchema = new Schema({
    pathName: String,
    mapStartingPosition: {
        x: Number,
        y: Number
    },
    pathRecords: {
        recordsType: [String],
        records: [{
                record: {
                    x: Number,
                    y: Number,
                },
                mapPosition: {
                    x: Number,
                    y: Number
                }
        }]
    }
});

const fightRecordsSchema = new Schema({
    name: String,
    records: [{
        x: Number,
        y: Number
    }]
});


const addMapRecordToDb = async (mapPosition, recordsType, records) => {
    mapPosition = {
        x: parseInt(mapPosition.x),
        y: parseInt(mapPosition.y)
    }
    try {
        console.log("connect to db...");
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to db ✔");
        console.log("creating new document...");
        const farmingMapRecordModel = mongoose.model('farmingMapRecords', farmingMapRecordSchema);
        console.log("document created ✔");
        console.log("find document in db...");
        let doc = await farmingMapRecordModel.findOne({ mapPosition });
        if (!doc) {
            console.log("no record for this map in db");
            console.log("creating new one in db...");
            await farmingMapRecordModel.create({
                mapPosition,
                mapRecords: [{
                    recordsType,
                    records
                }]
            })
            console.log("document inserted in db ✔");
        } else {
            console.log("record already exist for this map in db");
            console.log(`searching records for type ${recordsType} on this map...`)
            let recordsToUpdate = doc.mapRecords.find(value => value.recordsType === recordsType);
            if (recordsToUpdate) {
                console.log(`records for type ${recordsType} already exist on this map`)
                console.log("Update records...")
                recordsToUpdate.records = records
                await doc.save();
                console.log("records updated ✔");
            } else {
                console.log("records for this type doesn't exist on this map");
                console.log("Insert records...")
                doc.mapRecords.push({
                    recordsType,
                    records
                })
                await doc.save();
                console.log("records inserted ✔");
            }
        }
        console.log("disconnect from db...");
        await mongoose.disconnect();
        console.log("disconnected from db ✔");
    } catch (error) {
        console.log(error);
    }
}


const addPathRecordToDb = async (pathName, mapStartingPosition, recordsType, records) => {
    mapStartingPosition = {
        x: parseInt(mapStartingPosition.x),
        y: parseInt(mapStartingPosition.y)
    }
    console.log(pathName, mapStartingPosition, recordsType, records);
    try {
        console.log("connect to db...");
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to db ✔");
        console.log("creating new document...");
        const farmingPathRecordModel = mongoose.model('farmingPathRecords', farmingPathRecordSchema);
        console.log("document created ✔");
        console.log("find document in db...");
        let doc = await farmingPathRecordModel.findOne({ pathName });
        if (!doc) {
            console.log("no record for this path in db");
            console.log("creating new one in db...");
            await farmingPathRecordModel.create({
                pathName,
                mapStartingPosition,
                pathRecords: {
                    recordsType,
                    records
                }
            })
            console.log("document inserted in db ✔");
        } else {
            console.log("record already exist for this path name in db");
        }
        console.log("disconnect from db...");
        await mongoose.disconnect();
        console.log("disconnected from db ✔");
    } catch (error) {
        console.log(error);
    }
}


const getMapRecordFromDb = async (recordsType, mapPosition = { x: -28, y: -44 }) => {
    try {
        console.log("connect to db...");
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to db ✔");
        console.log("creating new document...");
        const farmingMapRecordModel = mongoose.model('farmingMapRecords', farmingMapRecordSchema);
        console.log("document created ✔");
        console.log("find document in db...");
        let doc = await farmingMapRecordModel.findOne({ mapPosition });
        console.log('document found in db ✔')
        console.log("disconnect from db...");
        await mongoose.disconnect();
        console.log("disconnected from db ✔");
        if(doc) {
            return doc.mapRecords.find(value => value.recordsType === recordsType).records;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}


const getPathRecordFromDb = async (pathName) => {
    try {
        console.log("connect to db...");
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to db ✔");
        console.log("creating new document...");
        const farmingPathRecordModel = mongoose.model('farmingPathRecords', farmingPathRecordSchema);
        console.log("document created ✔");
        console.log("find document in db...");
        let doc = await farmingPathRecordModel.findOne({ pathName });
        console.log('document found in db ✔')
        console.log("disconnect from db...");
        await mongoose.disconnect();
        console.log("disconnected from db ✔");
        return doc;
    } catch (error) {
        console.log(error);
    }
}


const getFightRecordFromDb = async () => {
    try{
        console.log("connect to db...");
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to db ✔");
        console.log("creating new document...");
        const fightRecordModel = mongoose.model('fightRecords', fightRecordsSchema);
        console.log("document created ✔");
        console.log("find document in db...");
        let doc = await fightRecordModel.find();
        return doc;
    }catch(error) {
        console.log(error);
    }
}


module.exports.addMapRecordToDb = addMapRecordToDb;
module.exports.getMapRecordFromDb = getMapRecordFromDb;
module.exports.addPathRecordToDb = addPathRecordToDb;
module.exports.getPathRecordFromDb = getPathRecordFromDb;
module.exports.getFightRecordFromDb = getFightRecordFromDb;