import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import * as https from 'https';
import { AddressInfo } from 'net';
import { CrankerConnector, connectToRouter } from 'nodejs-cranker-connector';


async function main() {

    let server: Server;
    let connector: CrankerConnector;

    const port = 0;
    const app: Express = express();

    app.use('/ui', express.static('ui'))
    app.get('/health', (req: Request, res: Response) => {
        res.send({
            component: 'ui',
            isHealthy: true,
            connector: connector?.state
        });
    });

    server = await new Promise((resolve) => {
        const ser = app.listen(port, () => { resolve(ser) });
    })

    const targetURI = `http://localhost:${(server.address() as AddressInfo).port}`;
    console.log(`express http server is running at ${targetURI}`);

    connector = await connectToRouter({
        targetURI,
        targetServiceName: 'ui',
        routerURIProvider: () => (["wss://localhost:12002"]),
        slidingWindow: 2,
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    });
}

main()
    .then(() => { console.log('server started') })
    .catch((error) => { console.error(error) })


