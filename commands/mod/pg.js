const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge messages")
    .addIntegerOption(opt => opt.setName("amount").setDescription("Number of messages to delete (max 100)").setRequired(true))
    .addStringOption(opt => opt.setName("type").setDescription("Type of messages to delete").setRequired(true).addChoices(
      { name: "All", value: "all" },
      { name: "Bot", value: "bot" },
      { name: "User", value: "user" }
    )),
  async execute(interaction) {
    try {
      const amount = interaction.options.getInteger("amount");
      const type = interaction.options.getString("type");
      const ch = interaction.channel;
      const actor = interaction.member;
      const botMb = interaction.guild.members.cache.get(interaction.client.user.id);

      if (!actor.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        const em1 = new EmbedBuilder().setColor(0x00ffff).setDescription("You do not have permission to manage messages");
        return interaction.reply({ embeds: [em1], ephemeral: true });
      }

      if (!botMb.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        const em2 = new EmbedBuilder().setColor(0x00ffff).setDescription("I do not have permission to manage messages");
        return interaction.reply({ embeds: [em2], ephemeral: true });
      }

      const msgs = await ch.messages.fetch({ limit: amount });
      let filtered;
      if (type === "all") filtered = msgs;
      else if (type === "bot") filtered = msgs.filter(m => m.author.bot);
      else filtered = msgs.filter(m => !m.author.bot);

      await ch.bulkDelete(filtered, true);
      const em3 = new EmbedBuilder()
        .setColor(0x00ffff)
        .setDescription(`${filtered.size} messages have been purged\nType: ${type}\nModerator: ${actor}`);
      await interaction.reply({ embeds: [em3] });

    } catch (err) {
      console.error("Error in purge command:", err);
      try {
        const em4 = new EmbedBuilder().setColor(0x00ffff).setDescription(`Failed to purge messages\n\`\`\`js\n${err}\`\`\``);
        await interaction.reply({ embeds: [em4], ephemeral: true });
      } catch {}
    }
  }
};
