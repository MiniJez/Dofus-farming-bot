const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ioHook = require('iohook');
require('dotenv').config();
const EventEmitter = require('events');


// Events
const eventEmmiter = new EventEmitter();


// Express setup
const port = 3001;
const app = express();
app.set('view engine', 'ejs')
app.set('views', './public/html')
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


// iohook
ioHook.start();


// Imports
const { setupListener, getMapRecordTab, clearMapRecordTab, getPathRecordTab, clearPathRecordTab } = require('./listeners');
setupListener(eventEmmiter);
const { addMapRecordToDb, addPathRecordToDb } = require('./mongodb');
const { launchPathRecord } = require('./automation');


//Routes
app.get('/', (req, res) => {
    res.render('index');
})

app.post('/mapRecord', async (req, res) => {
    const { status, recordsType, mapPosition } = req.body;
    if (status === "start") {
        console.log('----process "start map record" start----');
        try {
            console.log("start record...");
            eventEmmiter.emit('startMouseClickMapRecord');
            console.log("record started ✔");
            console.log("----process done");
            res.send('OK');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    } else if (status === "stop") {
        console.log('----process "stop map record" start----');
        try {
            console.log("stop record...")
            eventEmmiter.emit('stopMouseClickMapRecord');
            console.log("record stoped ✔");
            console.log("get record data...");
            let recordTab = getMapRecordTab();
            console.log(recordTab);
            clearMapRecordTab();
            console.log("got data ✔");
            await addMapRecordToDb(mapPosition, recordsType, recordTab);
            console.log('----process done----');
            res.send('OK');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
})

app.post('/pathRecord', async (req, res) => {
    const { status, recordsType, mapPosition, pathName } = req.body;
    if (status === "start") {
        console.log('----process "start path record" start----');
        try {
            console.log("start record...");
            eventEmmiter.emit('startMouseClickPathRecord');
            console.log("record started ✔");
            console.log("----process done-----");
            res.send('OK');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    } else if (status === "stop") {
        console.log('----process "stop path record" start----');
        try {
            console.log("stop record...")
            eventEmmiter.emit('stopMouseClickPathRecord');
            console.log("record stoped ✔");
            console.log("get record data...");
            let recordTab = getPathRecordTab();
            console.log(recordTab);
            clearPathRecordTab();
            console.log("got data ✔");
            await addPathRecordToDb(pathName, mapPosition, recordsType, recordTab);
            console.log('----process done----');
            res.send('OK');
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }
})

app.get('/launchRecord', async (req, res) => {
    console.log('----process launch record start----');
    try {
        await launchPathRecord("blé test short");
        console.log('----process done----');
        res.send('OK');
    }catch(error) {
        console.log(error);
        res.send(error);
    }
})


//Listen
app.listen(port, () => {
    console.log(`Bot listening on port ${port}!`);
})