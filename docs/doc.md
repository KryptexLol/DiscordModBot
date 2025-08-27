# config Docs

**This file contains configuration options for your Discord bot, Each setting is explained below**

**config.json**

```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID",
  "useGuildCommands": true,
  "cooldown": 3
}
```

# Configuration Options

**token**

**Type:** string

**Description:** Your Discord bot token.

**Where to get it:** From the [Discord Developer Portal](https://discord.com/developers/applications)

**Example:**

```json
"token": "NzI1...YOUR_TOKEN..."
```



**clientId**

**Type:** string

**Description:** The bots client ID is used for registering slash commands via the REST API.

**Where to get it:** From the General Information page in your bot application.

**Example:**

```json
"clientId": "123456789012345678"
```



**guildId**

**Type:** string

**Description:** The ID of the server (guild) where you want to register guild-specific commands

**When to use:** Only required if useGuildCommands is true.

**Example:**

```json
"guildId": "987654321098765432"
```



# useGuildCommands

**Type:** boolean

**Description:** Determines whether commands are registered globally or only for a specific guild.

***Values:***

**true** → Register commands only in the guild specified by guildId (faster updates, ideal for testing)

**false** → Register commands globally (takes up to 1 hour to update)


**Example:**

```json
"useGuildCommands": true
```


# cooldown

**Type:** number

**Description:** Sets the per-user cooldown for all commands, Prevents users from spamming the commands.

**Example:**
```json
"cooldown": 3
```
**Each user can run a command once every 3 seconds**

