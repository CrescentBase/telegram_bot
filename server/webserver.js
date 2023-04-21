import { getLogger, log4js } from '../utils/LoggerUtils.js';
import express from 'express';
import cors from 'cors';
import queryRouter from './query.js';
import {loadBot} from "../bot/bot.js";

const logger = getLogger("app");
const app = express();
app.disable('x-powered-by');
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    // origin: '*',
    credentials: true
}));
app.use('/bot', queryRouter);

const port = process.env.Port || 9001

let mainFunc = async () => {
    loadBot();
    app.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`);
    })
}

await mainFunc();

