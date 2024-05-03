const fs = require('node:fs');
const path = require('node:path');
const showName = "Amazing Race";
const showNamePath = showName.replaceAll(' ', '');
const weekName = 'Week 1';
const weekFileName = weekName.replaceAll(' ', '') + '.json';

const weekDataPath = path.join(process.cwd(), 'app', 'weekData', showNamePath);
const weekDataFilePath = path.join(weekDataPath, weekFileName);
try {
    const content = {
        testKey: "testValue"
    }
    const contentAsJson = JSON.stringify(content);
    fs.writeFileSync(weekDataFilePath, contentAsJson);
} catch (err) {
    console.error(err);
}

