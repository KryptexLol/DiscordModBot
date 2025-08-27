const { Client, Collection, GatewayIntentBits, REST, Routes } = require("discord.js")
const { readdirSync } = require("fs")
const { join } = require("path")
const chalk = require("chalk")
const cfg = require("./data/c.json")
const bot = new Client({ intents: [GatewayIntentBits.Guilds] })
bot.slashCommands = new Collection()
const api = new REST({ version: "10" }).setToken(cfg.token)
const slashPayload = []
const cmdPath = join(__dirname, "commands")
function grabCommands(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) grabCommands(join(dir, entry.name))
    else if (entry.name.endsWith(".js")) {
      try {
        const cmdFile = require(join(dir, entry.name))
        if (cmdFile.data && cmdFile.execute) {
          bot.slashCommands.set(cmdFile.data.name, cmdFile)
          slashPayload.push(cmdFile.data.toJSON())
          console.log(chalk.blue(`loaded >> command ${cmdFile.data.name}`))
        }
      } catch (err) {
        console.error(chalk.red(`Failed to load command file ${entry.name}:`), err)
      }
    }
  }
}
grabCommands(cmdPath)
const evtPath = join(__dirname, "events")
function grabEvents(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) grabEvents(join(dir, entry.name))
    else if (entry.name.endsWith(".js")) {
      try {
        const evtFile = require(join(dir, entry.name))
        if (evtFile.name && evtFile.execute) {
          if (evtFile.once) bot.once(evtFile.name, (...args) => {
            try { evtFile.execute(...args, bot) } catch (e) { console.error(chalk.red(`Error in event ${evtFile.name}:`), e) }
          })
          else bot.on(evtFile.name, (...args) => {
            try { evtFile.execute(...args, bot) } catch (e) { console.error(chalk.red(`Error in event ${evtFile.name}:`), e) }
          })
          console.log(chalk.blue(`loaded >> event ${evtFile.name}`))
        }
      } catch (err) {
        console.error(chalk.red(`Failed to load event file ${entry.name}:`), err)
      }
    }
  }
}
grabEvents(evtPath)
;(async () => {
  try {
    console.log(chalk.yellow("Sucking commands"))
    if (cfg.useGuildCommands) {
      await api.put(Routes.applicationGuildCommands(cfg.clientId, cfg.guildId), { body: [] })
      console.log(chalk.red("Cleared old guild commands"))
      await api.put(Routes.applicationGuildCommands(cfg.clientId, cfg.guildId), { body: slashPayload })
      console.log(chalk.green("loaded guild commands"))
    } else {
      await api.put(Routes.applicationCommands(cfg.clientId), { body: [] })
      console.log(chalk.red("Cleared old global commands"))
      await api.put(Routes.applicationCommands(cfg.clientId), { body: slashPayload })
      console.log(chalk.green("loaded global commands"))
    }
    bot.login(cfg.token)
  } catch (err) {
    console.error(chalk.red("Failed to register commands:"), err)
  }
})()
