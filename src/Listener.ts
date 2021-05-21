import {client} from "./Main";

import {Role} from "discord.js";
import express, {Express, Request, Response} from "express";

export interface VerificationData {
  token: string,
  userId: string
}

export let verificationDataStore: Array<VerificationData> = [];
const app: Express = express();

export function removeVerificationData(token: string): void {
  verificationDataStore = verificationDataStore.filter(verificationData => token != verificationData.token);
}

export function listen(): void {

  app.get("/verify", (req: Request, res: Response) => {
    let rawToken: any = req.query["token"];
    if(typeof rawToken === "string" && rawToken.length === 96) {
      let userToken: string = rawToken;
      let matches = verificationDataStore.filter(verificationData => userToken === verificationData.token);
      if(matches.length == 1) {
        let userVerificationData = matches[0];

        // Verify the user in all servers the bot knows about.
        client.guilds.cache.forEach(guild => {
          guild.members.fetch(userVerificationData.userId).then(member => {

            let role: Role | undefined = guild.roles.cache.find(role => role.name === "verified");
            if (role) {
              member.roles.add(role!).then(_ => {
              });
              member.send(`Verified for ${guild.name} !`).then(_ => {
              });
            }
          }).catch(_ => {});
        });

        removeVerificationData(userToken);

        res.status(200).send("Verified!");
      } else {
        res.status(401).send("Invalid token.");
      }
    } else {
      res.status(400).send("Server error.");
    }
  })

  app.listen(process.env.PORT || 3000);
}