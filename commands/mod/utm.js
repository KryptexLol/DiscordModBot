const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Untimeout a member")
    .addUserOption(opt => opt.setName("target").setDescription("Select a user").setRequired(true)),
  async execute(interaction) {
    try {
      const usr = interaction.options.getUser("target");
      const mb = interaction.guild.members.cache.get(usr.id);
      const actor = interaction.member;
      const botMb = interaction.guild.members.cache.get(interaction.client.user.id);

      if (!actor.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        const em1 = new EmbedBuilder().setColor(0x00ffff).setDescription("You do not have permission to remove timeouts");
        return interaction.reply({ embeds: [em1], ephemeral: true });
      }

      if (!botMb.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        const em2 = new EmbedBuilder().setColor(0x00ffff).setDescription("I do not have permission to remove timeouts");
        return interaction.reply({ embeds: [em2], ephemeral: true });
      }

      if (!mb.moderatable) {
        const em3 = new EmbedBuilder().setColor(0x00ffff).setDescription("I cannot remove timeout from this user");
        return interaction.reply({ embeds: [em3], ephemeral: true });
      }

      await mb.timeout(null);
      const em4 = new EmbedBuilder().setColor(0x00ffff).setDescription(`${usr.tag} has been untimeouted\nModerator: ${actor}`);
      await interaction.reply({ embeds: [em4] });

    } catch (err) {
      console.error("Error in untimeout command:", err);
      try {
        const em5 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to remove timeout\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em5], ephemeral: true });
      } catch {}
    }
  }
};
