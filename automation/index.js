const robot = require('robotjs');
const { getPathRecordFromDb, getMapRecordFromDb, getFightRecordFromDb } = require('../mongodb');
const { spawn } = require('child_process');

const launchPathRecord = async (pahtName) => {
    let pathRecord = await getPathRecordFromDb(pahtName);
    console.log(pathRecord)

    for (const recordType of pathRecord.pathRecords.recordsType) {
        let firstRecord = await getMapRecordFromDb(recordType, pathRecord.mapStartingPosition);
        await clickOnRecords(firstRecord);
    }

    for (const record of pathRecord.pathRecords.records) {
        await clickOnRecords([record.record])
        await sleep(5000);

        for (const recordType of pathRecord.pathRecords.recordsType) {
            let mapRecord = await getMapRecordFromDb(recordType, record.mapPosition);
            if (mapRecord) {
                await clickOnRecords(mapRecord);
            }
        }
    }
}

const clickOnRecords = async (records) => {
    for (const record of records) {
        console.log(`move and click on record x:${record.x}, y:${record.y}`)
        robot.moveMouse(record.x, record.y);
        robot.mouseClick();
        await sleep(3000);
        const python = spawn('py', ['./python/main.py', 'combat']);
        let combatStatus;
        python.stdout.on('data', (data) => {
            combatStatus = data.toString();
        });
        await sleep(3000);
        if (!combatStatus.includes("None")) {
            console.log('Combat detected');
            await fight();
        }
    }
}


const clickOnRecordsFight = async (records) => {
    for (const record of records) {
        console.log(`move and click on record x:${record.x}, y:${record.y}`)
        robot.moveMouse(record.x, record.y);
        await sleep(500);
        robot.mouseClick();
        const python = spawn('py', ['./python/main.py', 'victory']);
        let combatStatus;
        python.stdout.on('data', (data) => {
            combatStatus = data.toString();
        });
        await sleep(2000);
        if (!combatStatus.includes("None")) {
            return true;
        }
    }
}


const fight = async () => {
    let records = await getFightRecordFromDb();
    console.log("click on ready");
    await clickOnRecordsFight(records.find(record => record.name === "terminer tour").records);
    let stopFight = false;
    while (!stopFight) {
        console.log("launch flèche magique 2 times");
        stopFight = await clickOnRecordsFight(records.find(record => record.name === "flèche magique").records);
        if(stopFight) continue;

        console.log("launch flèche harcelante 1 times");
        stopFight = await clickOnRecordsFight(records.find(record => record.name === "flèche harcelante").records);
        if(stopFight) continue;

        await clickOnRecordsFight(records.find(record => record.name === "terminer tour").records);
        await sleep(5000);
    }
    console.log("combat ended ✔");
    console.log("close victory tab");
    await clickOnRecordsFight(records.find(record => record.name === "victory").records);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


module.exports.launchPathRecord = launchPathRecord;