const express = require('express');
const https = require('https');
const { spawn } = require('child_process');
const fs = require('fs');

// Timeout variable
var downTimeOut = "n/a";

// Upper limit on number of milliseconds that the awning takes to open fully
const THRESHOLD = 45000;

// Express App
const app = express();
app.listen(3000);

app.post('/stop', (req,res) =>
{
    try
    {
        clearTimeout(downTimeOut);
    }
    catch (e)
    {
        console.log(e);
    }
    onStop(res);
});

app.post('/up', (req,res) =>
{
    try
    {
        clearTimeout(downTimeOut);
    }
    catch (e)
    {
        console.log(e);
    }
    onUp(res);
});

app.post('/down', (req,res) =>
{
    try
    {
        clearTimeout(downTimeOut);
    }
    catch (e)
    {
        console.log(e);
    }
    onDown(res);
});

// ------------------------------ //

function getPromise()
{
    return new Promise((resolve,reject) =>
    {
        https.get(options, (res) =>
        {
            let data = '';
            let isWindy = false;
            if (res.statusCode == 200)
            {
                res.on('data', (chunk) =>
                {
                    data += chunk;
                });
                
                res.on('end', () =>
                {
                    data = JSON.parse(data);
                    let windSpeed = data.properties.periods[0].windSpeed;
                    isWindy = determineWindiness(windSpeed);
                    resolve(isWindy);
                });
                
                res.on('error', (error) =>
                {
                    reject(error);
                });
            }
        });
    });
}

async function getAPI()
{
    try
    {
        let httpsPromise = getPromise();
        let response = await httpsPromise;
        return response;
    }
    catch (error)
    {
        console.log(error);
    }
}

function readJson()
{
    var downTime, upTime, last;
    fs.readFileSync('/home/pi/Desktop/Projects/RemoteController2/json/downTime.json', (err, data) =>
    {
        if (err) console.log(err);
        else
        {
            downTime = (JSON.parse(data.toString())).downTime;
        }
    });
    
    fs.readFileSync('/home/pi/Desktop/Projects/RemoteController2/json/upTime.json', (err, data) =>
    {
        if (err) console.log(err);
        else
        {
            upTime = (JSON.parse(data.toString())).upTime;
        }
    });
    
    fs.readFileSync('/home/pi/Desktop/Projects/RemoteController2/json/last.json', (err, data) =>
    {
        if (err) console.log(err);
        else
        {
            last = (JSON.parse(data.toString())).last;
        }
    });
    
    return {"downTime":downTime,"upTime":upTime,"last":last};
}

function updateNetTime()
{
    var data = readJson();
    var last = data.last;
    fs.readFileSync('/home/pi/Desktop/Projects/RemoteController2/json/netTime.json', (err, data) =>
    {
        if (err) console.log(err);
        else
        {
            var previousNetTime = (JSON.parse(data.toString())).netTime;
            
            if (last == "down")
            {
                var difference = Date.now() - data.downTime;
                difference = (difference >= THRESHOLD) ? previousNetTime : difference;
                var netTime = { "netTime" : (previousNetTime - difference) };
                data = JSON.stringify(netTime);
                fs.writeFile('/home/pi/Desktop/Projects/RemoteController2/json/netTime.json', data, () => {});
            }
            else if (last == "up")
            {
                var difference = Date.now() - data.upTime;
                difference = (difference >= THRESHOLD) ? THRESHOLD - previousNetTime : difference;
                var netTime = { "netTime" : (previousNetTime + difference) };
                data = JSON.stringify(netTime);
                fs.writeFile('/home/pi/Desktop/Projects/RemoteController2/json/netTime.json', data, () => {});
            }
        }
    });
}
// ------------------------------ //

function onStop(res)
{
    if (readJson().last != "stop")
    {
        pythonStop();
        updateNetTime();
        var last = { "last":"stop" };
        var data = JSON.stringify(last);
        fs.writeFileSync('/home/pi/Desktop/Projects/RemoteController2/json/last.json', data, () => {});
    }
    res.sendStatus(200);
}

function onUp(res)
{
    if (readJson().last != "up")
    {
        updateNetTime();
        
        var upTime = { "upTime":Date.now() };
        
        pythonUp();
        
        var data = JSON.stringify(upTime);
        fs.writeFile('/home/pi/Desktop/Projects/RemoteController2/json/upTime.json', data, () => {});
        
        var last = { "last":"up" };
        data = JSON.stringify(last);
        fs.writeFileSync('/home/pi/Desktop/Projects/RemoteController2/json/last.json', data, () => {});
    }
    res.sendStatus(200);
}

function onDown(res)
{
    var data;
    if (readJson().last != "down")
    {
        updateNetTime();
        fs.readFile('/home/pi/Desktop/Projects/RemoteController2/json/netTime.json', (err, data) =>
        {
            if (err) console.log(err);
            else
            {
                var netTime = (JSON.parse(data.toString())).netTime;
                
                var downTime = { "downTime":Date.now() };
                
                pythonDown();
                
                data = JSON.stringify(downTime);
                fs.writeFile('/home/pi/Desktop/Projects/RemoteController2/json/downTime.json', data, () => {});
                downTimeOut = setTimeout(() =>
                {
                    pythonStop();
                }, netTime);
            }
        });
        var last = { "last":"down" };
        data = JSON.stringify(last);
        fs.writeFileSync('/home/pi/Desktop/Projects/RemoteController2/json/last.json', data, () => {});
    }
    res.sendStatus(200);
}

// ------------------------------ //

function pythonStop()
{
    spawn('python', ['/home/pi/Desktop/Projects/RemoteController2/python/stop.py']);
}

function pythonUp()
{
    spawn('python', ['/home/pi/Desktop/Projects/RemoteController2/python/up.py']);
}

function pythonDown()
{
    spawn('python', ['/home/pi/Desktop/Projects/RemoteController2/python/down.py']);
}
