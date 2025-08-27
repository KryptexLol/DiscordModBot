const { SlashCommandBuilder, EmbedBuilder, version } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Displays info about the bot"),
  async execute(interaction) {
    try {
      const ur = interaction.user;
      const bot = interaction.client;
      const up = Math.floor(bot.uptime / 1000);
      const em1 = new EmbedBuilder()
        .setColor(0x00ffff)
        .setDescription(
          `Bot Username: ${bot.user.tag}\n` +
          `Bot ID: ${bot.user.id}\n` +
          `Owner: <@${ur.id}>\n` +
          `Servers: ${bot.guilds.cache.size}\n` +
          `Users: ${bot.users.cache.size}\n` +
          `WebSocket Ping: ${bot.ws.ping}ms\n` +
          `Uptime: ${up}s\n` +
          `Discord.js Version: v${version}`
        );
      await interaction.reply({ embeds: [em1] });
    } catch (err) {
      console.error("Error in botinfo:", err);
      try {
        const em2 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to fetch bot info\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em2], ephemeral: true });
      } catch {}
    }
  }
};
