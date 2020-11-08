const iohook = require("iohook");


// Variables
let mapRecordTab = [];
let pathRecordTab = [];


const setupListener = (eventEmitter) => {
    eventEmitter.on('startMouseClickMapRecord', () => {
        iohook.addListener('mouseclick', onMouseCLickMapRecord)
    })

    eventEmitter.on('stopMouseClickMapRecord', () => {
        iohook.removeListener('mouseclick', onMouseCLickMapRecord)
    })

    eventEmitter.on('startMouseClickPathRecord', () => {
        iohook.addListener('mouseclick', onMouseCLickPathRecord)
    })

    eventEmitter.on('stopMouseClickPathRecord', () => {
        iohook.removeListener('mouseclick', onMouseCLickPathRecord)
    })
}


const onMouseCLickMapRecord = (event) => {
    mapRecordTab.push(event),
    console.log(mapRecordTab)
}


const onMouseCLickPathRecord = (event) => {
    pathRecordTab.push(event),
    console.log(pathRecordTab)
}


const getMapRecordTab = () => {
    mapRecordTab.pop();
    return mapRecordTab.map((value) => {
        return { x: value.x, y: value.y }
    });
}


const getPathRecordTab = () => {
    pathRecordTab.pop();
    return pathRecordTab.map((value) => {
        return { 
            record: {
                x: value.x, 
                y: value.y
            },
            mapPosition: {
                x: null,
                y: null
            }
        }
    });
}


const clearMapRecordTab = () => {
    mapRecordTab = [];
}


const clearPathRecordTab = () => {
    pathRecordTab = [];
}


module.exports.setupListener = setupListener;
module.exports.getMapRecordTab = getMapRecordTab;
module.exports.clearMapRecordTab = clearMapRecordTab;
module.exports.getPathRecordTab = getPathRecordTab;
module.exports.clearPathRecordTab = clearPathRecordTab;