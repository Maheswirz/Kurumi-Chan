export default {
  name: "ping",
  description: "Cek bot",
  async execute(ctx) {
    // SLASH COMMAND
    if (ctx.reply) {
      await ctx.reply("🏓 Pong!");
    }
    // PREFIX COMMAND
    else {
      await ctx.channel.send("🏓 Pong!");
    }
  }
};
