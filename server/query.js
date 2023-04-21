import express from "express";
const router = express.Router();
import {normalResultHandler, errorHandler} from '../utils/RequestUtils.js';
import util from "util";

let requestMethod = router.get.bind(router);

router.post("/tg_bot", async (req, res) => {
    try {
        console.log('tg_bot', req.body);
        normalResultHandler(true, res, req, false);
    } catch(err) {
        console.log("tg_bot", util.inspect(err));
        normalResultHandler(false, res, req, false);
    }
});


export default router;
