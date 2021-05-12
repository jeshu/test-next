// import cors from 'cors';
import nextApp from '@droan-app/webapp';
import express from 'express';
import WebSocket from 'ws';
import redis from 'redis';

const redisPort: number = parseInt(process.env.REDIS_PORT as string) || 6379,
  redisHost = process.env.REDIS_HOST || 'localhost' || '52.249.250.55',
  reidsPassword = process.env.REDIS_PASSWORD,
  redisClient: any = redis.createClient({ port: redisPort, host: redisHost, password: reidsPassword }),
  WebSocketServer = WebSocket.Server,
  streamName = process.env.STREAM || 'inspection';


const port = process.env.PORT || 3000;
const handle = nextApp.getRequestHandler();

async function createServer() {
  try {
    const app = express();
    app.use(express.json());

    await nextApp.prepare();
    app.get('*', (req, res) => handle(req, res));

    var readStream = function () {
      console.log('redis stream read...')
      redisClient.XREAD('Block', 10000000, 'STREAMS', streamName, '$', function (err: any, stream: any) {
        console.log('redis stream xread read...')
        readStream();
        if (err) {
          return console.error(err);
        }
        console.log(stream[0][1][0][1]);
        
        // const image = stream;
        wss.clients.forEach(function each(client: any) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(stream[0][1]));
          }
        });
      });
    };
    
    readStream();
    app.listen({ port }, () => {
      console.log(
        `🚀 Server ready at http://localhost:${port}`
      );
    });

    const wss = new WebSocketServer({port:3625});

    wss.on('connection', function (ws) {
      ws.on('message', function (message) {
        console.log('received: %s', message)
      });
    });
  } catch (err) {
    console.log(err);
  }
}


createServer();