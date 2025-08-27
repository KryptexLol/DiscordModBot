const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a member")
    .addStringOption(opt => opt.setName("userid").setDescription("ID of the user to unban").setRequired(true)),
  async execute(interaction) {
    try {
      const id = interaction.options.getString("userid");
      const gd = interaction.guild;
      const actor = interaction.member;
      const botMb = gd.members.cache.get(interaction.client.user.id);

      if (!actor.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        const em1 = new EmbedBuilder().setColor(0x00ffff).setDescription("You do not have permission to unban members");
        return interaction.reply({ embeds: [em1], ephemeral: true });
      }

      if (!botMb.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        const em2 = new EmbedBuilder().setColor(0x00ffff).setDescription("I do not have permission to unban members");
        return interaction.reply({ embeds: [em2], ephemeral: true });
      }

      const bans = await gd.bans.fetch();
      const usr = bans.get(id);
      if (!usr) {
        const em3 = new EmbedBuilder().setColor(0x00ffff).setDescription("This user is not banned");
        return interaction.reply({ embeds: [em3], ephemeral: true });
      }

      await gd.members.unban(id);
      const em4 = new EmbedBuilder().setColor(0x00ffff).setDescription(`${usr.user.tag} has been unbanned\nModerator: ${actor}`);
      await interaction.reply({ embeds: [em4] });

    } catch (err) {
      console.error("Error in unban command:", err);
      try {
        const em5 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to unban the user\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em5], ephemeral: true });
      } catch {}
    }
  }
};
