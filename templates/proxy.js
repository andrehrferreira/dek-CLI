module.exports = () => {
    return `import dotenv from "dotenv";
import proxy from "express-http-proxy";
import express from "express";

let router = express.Router();

export default () => {
    router.use('/', proxy(process.env.PROXY_URL));
    return router;
}`;
};
