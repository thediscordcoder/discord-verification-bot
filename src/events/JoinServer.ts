import {
  On,
  ArgsOf,
} from "@typeit/discord";

export abstract class JoinServer {

  @On("guildCreate")
  guildJoin([guild]: ArgsOf<"guildCreate">): void {
    let verifiedRole = guild.roles.cache.find(role => role.name === "verified");

    if(!verifiedRole) {
      guild.roles.create({
      "data": {
        "name": "verified",
        "color": "#313af5"
      }, "reason": "Keeps track of verified users."
      }).then(verifiedRole => {
        // Add all users to verified by default
        guild.members.cache.forEach(user => {
          user.roles.add(verifiedRole, "Assume all users are verified when the bot is added.").then(user => {});
        });
      });
    }

    guild.roles.everyone.setPermissions("VIEW_CHANNEL", "Remove permissions for non-verified users.").then(_ => {});

  }
}