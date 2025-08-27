const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays info about a user")
    .addUserOption(opt => opt.setName("target").setDescription("Select a user").setRequired(false)),
  async execute(interaction) {
    try {
      const ur = interaction.options.getUser("target") || interaction.user;
      const mb = interaction.guild.members.cache.get(ur.id);
      const rl = mb ? mb.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.name).join(", ") || "None" : "Unknown";
      const hr = mb ? mb.roles.highest.name : "Unknown";
      const st = mb ? mb.presence?.status || "offline" : "offline";
      const gd = interaction.guild;

      const em1 = new EmbedBuilder()
        .setColor(0x00ffff)
        .setThumbnail(ur.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `Username: ${ur.tag}\n` +
          `User ID: ${ur.id}\n` +
          `Bot: ${ur.bot ? "Yes" : "No"}\n` +
          `Server Join: ${mb ? `<t:${Math.floor(mb.joinedTimestamp / 1000)}:R>` : "Unknown"}\n` +
          `Account Created: <t:${Math.floor(ur.createdTimestamp / 1000)}:R>\n` +
          `Status: ${st}\n` +
          `Roles: ${rl}\n` +
          `Highest Role: ${hr}`
        );

      await interaction.reply({ embeds: [em1] });
    } catch (err) {
      console.error("Error in userinfo:", err);
      try {
        const em2 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to fetch user info\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em2], ephemeral: true });
      } catch {}
    }
  }
};
