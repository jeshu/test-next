'use strict';

import nextApp from '@droan-app/webapp';
import express from 'express';
import WebSocket from 'ws';
import redis from 'redis';

const redisPort: number = parseInt(process.env.REDIS_PORT as string) || 6379,
  redisHost = process.env.REDIS_HOST || '40.117.227.179', //|| || ,
  // reidsPassword = process.env.REDIS_PASSWORD,
  WebSocketServer = WebSocket.Server,
  streamName = process.env.STREAM || 'inspection';
// const STREAMS_KEY = "inspection";

const port = process.env.PORT || 3000;
const handle = nextApp.getRequestHandler();

async function createServer() {
  try {
    const app = express();
    app.use(express.json());

    await nextApp.prepare();
    app.get('*', (req, res) => handle(req, res));

    app.listen({ port }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${port}`
      );
    });

    const readStream = function (ws: any) {
      console.log('redis stream read...')
      const rc: any = redis.createClient({ port: redisPort, host: redisHost });
      const xreadStream = (endId: string) => rc.xread('Block', 2000, 'STREAMS', 'inspectiondata', endId, function (err: any, stream: any) {
        if (err) {
          return console.error(err);
        }
        let lastId = '$'
        if (stream) {
          const streamLength = stream[0][1].length;
          lastId = stream[0][1][streamLength - 1][0];
          const data = stream[0][1][0][1];
          const finalData: any = {};
          for (let i = 0; i <= data.length; i += 2) {
            finalData[data[i]] = data[i + 1];
          }
          ws.send(JSON.stringify(finalData));
        }
        xreadStream(lastId);
      });
      xreadStream('$');
    }

    function startInspection(inspectionId: string, ws: any) {
      const rc: any = redis.createClient({ port: redisPort, host: redisHost });
      rc.xadd(`${streamName}`, '*',
        'inspectionId', inspectionId,
        function (err: any, res: any) {
          if (err) { console.log(err) };
          console.log(res);
          mock_inspection_data('inspectiondata', rc);
          readStream(ws);
        });
    }

    const wss = new WebSocketServer({ port: 3625 });

    wss.on('connection', function (ws) {
      ws.on('message', function (message: string) {
        console.log(`web socket connection message : ${message}`);
        if (message.indexOf('inspection|') === 0) {
          startInspection((message.replace('inspection|', '')), ws);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}


function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function mock_inspection_data(inspectionId: string, rc: any) {

  var sleep_time = 300;
  var loop_nb = 20;

  console.log(`\nThis program will send ${loop_nb} messages, every ${sleep_time}ms`);

  for (var i = 0; i <= loop_nb; i++) {
    console.log(`\tSending message ${i}`);
    // produce the message
    rc.xadd(inspectionId, '*',
      "cultivatedLand", "98.92646074295044",
      "inFertileLand", "0.0",
      "other", "98.93871545791626",
      "fileName", `https://droneredissg.blob.core.windows.net/droneimages/${i}.jpg`,
      "weather", "Rain",
      "damageArea", "0",
      "water", "0",
      "highQualityCrop", '0',
      "lowQualityCrop", '0',
      "windSpeed", "5",
      function (err: any) {
        if (err) { console.log(err) };
      });
    await sleep(sleep_time);
  }
  rc.xadd(inspectionId, '*',
    "cultivatedLand", "98.92646074295044",
    "inFertileLand", "0.0",
    "other", "98.93871545791626",
    "fileName", `https://droneredissg.blob.core.windows.net/droneimages/${i}.jpg`,
    "weather", "Rain",
    "damageArea", "0",
    "windSpeed", "5",
    "highQualityCrop", '0',
    "lowQualityCrop", '0',
    "water", "0",
    "isDone", "true",
    function (err: any) {
      if (err) { console.log(err) };
    });
}

// main();

createServer();