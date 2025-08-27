const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .addUserOption(opt => opt.setName("target").setDescription("Select a user").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for ban").setRequired(false)),
  async execute(interaction) {
    try {
      const usr = interaction.options.getUser("target");
      const mb = interaction.guild.members.cache.get(usr.id);
      const rsn = interaction.options.getString("reason") || "No reason provided";
      const actor = interaction.member;
      const botMb = interaction.guild.members.cache.get(interaction.client.user.id);

      if (!actor.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        const em1 = new EmbedBuilder().setColor(0x00ffff).setDescription("You do not have permission to ban members");
        return interaction.reply({ embeds: [em1], ephemeral: true });
      }

      if (!botMb.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        const em2 = new EmbedBuilder().setColor(0x00ffff).setDescription("I do not have permission to ban members");
        return interaction.reply({ embeds: [em2], ephemeral: true });
      }

      if (!mb.bannable) {
        const em3 = new EmbedBuilder().setColor(0x00ffff).setDescription("I cannot ban this user");
        return interaction.reply({ embeds: [em3], ephemeral: true });
      }

      await mb.ban({ reason: rsn });
      const em4 = new EmbedBuilder()
        .setColor(0x00ffff)
        .setDescription(`${usr.tag} has been banned\nReason: ${rsn}\nModerator: ${actor}`);
      await interaction.reply({ embeds: [em4] });

    } catch (err) {
      console.error("Error in ban command:", err);
      try {
        const em5 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to ban the user\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em5], ephemeral: true });
      } catch {}
    }
  }
};
