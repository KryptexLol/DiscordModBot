const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Displays info about the server"),
  async execute(interaction) {
    try {
      const gd = interaction.guild;
      const members = gd.members.cache;
      const total = members.size;
      const online = members.filter(m => m.presence?.status === "online").size;
      const idle = members.filter(m => m.presence?.status === "idle").size;
      const dnd = members.filter(m => m.presence?.status === "dnd").size;
      const offline = total - online - idle - dnd;
      const chs = gd.channels.cache.size;
      const roles = gd.roles.cache.size;
      const boosts = gd.premiumSubscriptionCount;

      const em1 = new EmbedBuilder()
        .setColor(0x00ffff)
        .setDescription(
          `Server Name: ${gd.name}\n` +
          `Server ID: ${gd.id}\n` +
          `Owner: <@${gd.ownerId}>\n` +
          `Members: ${total}\n` +
          `Online: ${online} | Idle: ${idle} | DND: ${dnd} | Offline: ${offline}\n` +
          `Channels: ${chs}\n` +
          `Roles: ${roles}\n` +
          `Boosts: ${boosts}\n` +
          `Created: <t:${Math.floor(gd.createdTimestamp / 1000)}:R>`
        );

      await interaction.reply({ embeds: [em1] });
    } catch (err) {
      console.error("Error in serverstats:", err);
      try {
        const em2 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to fetch server info\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em2], ephemeral: true });
      } catch {}
    }
  }
};
