# discord-verification-bot
Verifies members of the wcu-cs-club discord server.

## Build
1. `git clone https://github.com/wcu-cs-club/discord-verification-bot`
2. `cd discord-verification-bot`
3. `npm i`
4. Using the .env.example, create a .env file.
5. Create a bot at https://discord.com/developers/applications.
    * Select an avatar.
    * Enable Server Members Intent on the bot page.
    * Add the token from the bot page to your .env file.
6. Add your application id from the general page to https://discordapi.com/permissions.html#2415930390
7. Run the bot with `npm run dev`
8. Use the generated url to add the bot to your server.