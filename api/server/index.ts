'use strict';

import nextApp from '@droan-app/webapp';
import express from 'express';
import WebSocket from 'ws';
import redis from 'redis';

const redisPort: number = parseInt(process.env.REDIS_PORT as string) || 6379,
  redisHost = process.env.REDIS_HOST || 'localhost', //|| || ,
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

    const readStream = function (inspectionId:string, ws:any) {
      console.log('redis stream read...')
      const rc: any = redis.createClient({ port: redisPort, host: redisHost });
      const xreadStream = (endId:string) => rc.xread('Block', 100, 'STREAMS', inspectionId, endId, function (err: any, stream: any) {
        if (err) {
          return console.error(err);
        }
        let lastId = '$'
        if(stream) { 
          const streamLength = stream[0][1].length;
          lastId = stream[0][1][streamLength - 1][0];
          ws.send(JSON.stringify(stream[0][1]));
        }
         xreadStream(lastId );
      });
      xreadStream('$');
    }

    function startInspection(inspectionId: string, ws:any) {
      const rc: any = redis.createClient({ port: redisPort, host: redisHost });
      rc.xadd(`${streamName}:test`, '*',
        'inspectionId', inspectionId,
        function (err: any, res: any) {
          if (err) { console.log(err) };
          console.log(res);
          mock_inspection_data(inspectionId, rc);
          readStream(inspectionId, ws);    
        });
    }
    
    const wss = new WebSocketServer({ port: 3625 });

    wss.on('connection', function (ws) {
      ws.on('message', function (message:string) {
        console.log(`web socket connection message : ${message}`);
        if(message.indexOf('inspection|') === 0) {
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

async function mock_inspection_data(inspectionId:string, rc: any) {

  var sleep_time = 1000;
  var loop_nb = 20;

  console.log(`\nThis program will send ${loop_nb} messages, every ${sleep_time}ms`);

  for (var i = 0; i <= loop_nb; i++) {
    console.log(`\tSending message ${i}`);
    // produce the message
    rc.xadd(inspectionId, '*',
      "CultivatedLand", "98.92646074295044",
      "InFertileLand", "0.0",
      "Others", "98.93871545791626",
      "FileUrl", `https://droneredissg.blob.core.windows.net/droneimages/${i}.jpg`,
      "Weather", "Rain",
      "WindSpeed", "5",
      function (err: any) {
        if (err) { console.log(err) };
      });

    await sleep(sleep_time);

  }

}

// main();

createServer();