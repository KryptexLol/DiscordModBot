const { EmbedBuilder } = require("discord.js");
const chalk = require("chalk");
const cooldowns = new Map();
const cfg = require("../../data/c.json");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, bot) {
    try {
      if (!interaction.isChatInputCommand()) return;
      const cmd = bot.slashCommands.get(interaction.commandName);
      if (!cmd) return;
      const now = Date.now();
      const userId = interaction.user.id;
      const cdKey = `${userId}-${cmd.data.name}`;
      const cooldownAmount = cfg.cooldown * 1000;
      if (cooldowns.has(cdKey)) {
        const expire = cooldowns.get(cdKey);
        if (now < expire) {
          const remaining = ((expire - now) / 1000).toFixed(1);
          const embed = new EmbedBuilder().setColor(0xff0000).setDescription(`You must wait ${remaining}s before using ${cmd.data.name} again`);
          try {
            if (!interaction.replied) await interaction.reply({ embeds: [embed], ephemeral: true });
          } catch (replyErr) {
            console.error(chalk.red(`Failed to send cooldown embed: ${replyErr}`));
          }
          return;
        }
      }
      cooldowns.set(cdKey, now + cooldownAmount);
      setTimeout(() => cooldowns.delete(cdKey), cooldownAmount);
      try {
        await cmd.execute(interaction);
      } catch (cmdErr) {
        console.error(chalk.red(`Error executing command ${cmd.data.name}:`), cmdErr);
        const embed = new EmbedBuilder().setColor(0xff0000).setDescription("There was an error executing this command");
        try {
          if (!interaction.replied) await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (replyErr) {
          console.error(chalk.red(`Failed to send error embed: ${replyErr}`));
        }
      }
    } catch (err) {
      console.error(chalk.red(`Unhandled interaction error:`), err);
      try {
        if (interaction && !interaction.replied) {
          const embed = new EmbedBuilder().setColor(0xff0000).setDescription("An unexpected error occurred");
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } catch {}
    }
  }
};
