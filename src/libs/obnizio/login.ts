import bodyParser from "body-parser";
import express from "express";
import getPort from "get-port";
import http from "http";
import fetch from "node-fetch";
import opn from "opn";
import { ObnizIOURL } from "./url";

const WebAppId = process.env.APP_ID || `wa_MjI`;
const WebAppToken =
  process.env.APP_TOKEN || `apptoken_X9jp0G6pbmG_XzC5yIKg9_oo7jMIUA3I2IPG58viAsAVyfHmJWmJYgaxnGzcg1kf`;

export default async (progress: any): Promise<string> => {
  return await new Promise(async (resolve, reject) => {
    // start server
    const port = await getPort();
    const server = await oauth(port, (err, access_token) => {
      server.close();
      if (err) {
        reject(err);
        return;
      }
      resolve(access_token);
    });

    progress(`Local Server Created PORT=${port}. Waiting Permission`)

    const redirect_uri = `http://localhost:${port}/code`;
    const open_url = `${ObnizIOURL}/login/oauth/authorize?webapp_id=${WebAppId}&redirect_uri=${redirect_uri}`;
    opn(open_url);
  });
};

function oauth(port: number, callback: any): Promise<http.Server> {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      callback(new Error(`Authentication Timeout`), null);
    }, 3 * 60 * 1000);

    const expressApp = express();

    expressApp.set("port", port);
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: false }));

    expressApp.get("/code", async (req: any, res: any, next: any) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      const code = req.query.code;
      try {
        const url = new URL(`${ObnizIOURL}/login/oauth/token`);
        url.searchParams.append("code", code);
        const response = await fetch(url, {
          method: "post",
          headers: {
            "authorization": `Bearer ${WebAppToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          res.status(500).send(`Authentication Failed.`);
          callback(new Error(`Authentication Failed`), null);
          return;
        }

        const json = await response.json();
        const token = json.token;
        callback(null, token);
      } catch (e) {
        res.status(500).send(`Authentication Failed.`);
        callback(e, null);
        return;
      }
      res.send(`Authentication Success. Close this page and back to your shell.`);
    });

    const server = http.createServer(expressApp);
    server.listen(port);
    server.on("error", (e: any) => {
      reject(e);
    });
    server.on("listening", () => {
      resolve(server);
    });
  });
}
