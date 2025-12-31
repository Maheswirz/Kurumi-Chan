export default {
  name: "say",
  description: "Bot mengirim pesan sesuai teks kamu",
  async execute(ctx, args) {

    // ===== SLASH COMMAND =====
    if (ctx.reply) {
      const pesan = ctx.options.getString("pesan");
      if (!pesan) {
        return ctx.reply({ content: "Pesan tidak boleh kosong.", ephemeral: true });
      }
      return ctx.reply(pesan);
    }

    // ===== PREFIX COMMAND =====
    if (!args.length) {
      return ctx.reply("❌ Tulis pesan setelah command.");
    }

    const pesan = args.join(" ");
    await ctx.channel.send(pesan);
  }
};
