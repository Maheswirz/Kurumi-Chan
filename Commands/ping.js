export default {
  name: "ping",
  description: "Cek bot aktif",
  async execute(interaction) {
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
    const diff = sent.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(`Pong! Latency: ${diff} ms`);
  }
};
