import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';


async function main() {

    let server: Server;

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
}

main()
    .then(() => { console.log('server started') })
    .catch((error) => { console.error(error) })


