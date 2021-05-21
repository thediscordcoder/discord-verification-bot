import {listen} from "./Listener";

import { Client } from "@typeit/discord";

require('dotenv').config();

export const client = new Client({
    classes: [
      `${__dirname}/*Discord.ts`, // glob string to load the classes
      `${__dirname}/*Discord.js`, // If you compile using "tsc" the file extension change to .js
      `${__dirname}/commands/*.ts`, // glob string to load the classes
      `${__dirname}/commands/*.js`, // glob string to load the classes
      `${__dirname}/events/*.ts`, // glob string to load the classes
      `${__dirname}/events/*.js`, // glob string to load the classes
    ],
    silent: false,
    variablesChar: ":"
});

client.login(process.env.DISCORD_BOT_TOKEN || "").then(_ => {});

listen();