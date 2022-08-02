import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { connectToRouter, CrankerConnector } from "nodejs-cranker-connector";


async function main() {

    let server: Server;
    let connector: CrankerConnector;

    const port = 0;
    const app: Express = express();

    app.use('/ui', express.static('ui'))
    app.get('/health', (req: Request, res: Response) => {
        res.send({
            component: 'ui',
            isHealthy: true
        });
    });

    server = await new Promise((resolve) => {
        const ser = app.listen(port, () => { resolve(ser) });
    })

    const targetURI = `http://localhost:${(server.address() as AddressInfo).port}`;
    console.log(`express http server is running at ${targetURI}`);

    connector = await connectToRouter({
        routerURIProvider: () => ['ws://localhost:12002'],
        targetURI: targetURI,
        targetServiceName: 'ui',
        slidingWindow: 2,
    })

}

main()
    .then(() => { console.log('server started') })
    .catch((error) => { console.error(error) })


