const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Shows a users avatar")
    .addUserOption(opt => opt.setName("target").setDescription("Select a user").setRequired(false)),
  async execute(interaction) {
    try {
      const ur = interaction.options.getUser("target") || interaction.user;
      const em1 = new EmbedBuilder()
        .setColor(0x00ffff)
        .setDescription(`${ur.tag}'s Avatar`)
        .setImage(ur.displayAvatarURL({ dynamic: true, size: 1024 }));
      await interaction.reply({ embeds: [em1] });
    } catch (err) {
      console.error("Error in avatar command:", err);
      try {
        const err = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to fetch avatar\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em2], ephemeral: true });
      } catch {}
    }
  }
};
