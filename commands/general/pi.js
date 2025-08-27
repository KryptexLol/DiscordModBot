const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows bot latency"),
  async execute(interaction) {
    const sent = Date.now();
    const em1 = new EmbedBuilder().setColor(0x00ffff).setDescription("Pinging, Please wait");
    const msg = await interaction.reply({ embeds: [em1], fetchReply: true });
    const diff = Date.now() - sent;
    const em2 = new EmbedBuilder()
      .setColor(0x00ffff)
      .setDescription(`Response Time: ${diff}ms\nWebSocket Ping: ${interaction.client.ws.ping}ms`);
    try {
      await interaction.editReply({ embeds: [em2] });
    } catch (err) {
      console.error("Failed to edit ping reply:", err);
    }
  }
};
