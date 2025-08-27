const chalk = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  execute(bot) {
    try {
      try {
        bot.user.setPresence({ status: "dnd" });
      } catch (err1) {
        console.error(chalk.red("Failed to set status:"), err1);
      }
      console.log(chalk.bgGreen.black(`Bot is online as ${bot.user.tag} `));
    } catch (err) {
      console.error(chalk.red("Error in ready event:"), err);
    }
  }
};
