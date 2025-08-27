const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Shows a users banner")
    .addUserOption(opt => opt.setName("target").setDescription("Select a user").setRequired(false)),
  async execute(interaction) {
    try {
      const ur = interaction.options.getUser("target") || interaction.user;
      const usrFetch = await ur.fetch();
      if (!usrFetch.bannerURL()) {
        const em1 = new EmbedBuilder().setColor(0x00ffff).setDescription(`${ur.tag} has no banner`);
        return interaction.reply({ embeds: [em1] });
      }
      const em2 = new EmbedBuilder()
        .setColor(0x00ffff)
        .setDescription(`${ur.tag}'s Banner`)
        .setImage(usrFetch.bannerURL({ dynamic: true, size: 1024 }));
      await interaction.reply({ embeds: [em2] });
    } catch (err) {
      console.error("Error in banner command:", err);
      try {
        const em3 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to fetch banner\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em3], ephemeral: true });
      } catch {}
    }
  }
};
