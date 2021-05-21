import {
  On,
  ArgsOf,
} from "@typeit/discord";

export abstract class UserJoin {

  @On("guildMemberAdd")
  memberJoin([member]: ArgsOf<"guildMemberAdd">): void {
    let verifiedRole = member.roles.cache.find(role => role.name === "verified");
    if(!verifiedRole) {
      member.send("Please verify your wcu email by typing !verify [your wcu email here]").then(_ => {});
    }
  }

}