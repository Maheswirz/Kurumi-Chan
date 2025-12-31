import { EmbedBuilder } from "discord.js";

export default {
  name: "serverinfo",
  description: "Tampilkan info server (member count, owner, roles)",
  async execute(interaction) {
    // dapatkan guild dari interaction
    const guild = interaction.guild;
    if (!guild) return interaction.reply({ content: "Command ini harus dipakai di server.", ephemeral: true });

    // dasar info
    const name = guild.name;
    const id = guild.id;
    const memberCount = guild.memberCount; // cepat & tanpa fetch
    const ownerId = (await guild.fetchOwner()).user.tag; // fetch owner untuk pasti
    const createdAt = `<t:${Math.floor(guild.createdTimestamp/1000)}:R>`; // discord relative time

    // buat embed
    const embed = new EmbedBuilder()
      .setTitle(`Info: ${name}`)
      .setThumbnail(guild.iconURL() || null)
      .addFields(
        { name: "Server ID", value: id, inline: true },
        { name: "Owner", value: ownerId, inline: true },
        { name: "Member Count", value: String(memberCount), inline: true },
        { name: "Dibuat", value: createdAt, inline: true }
      )
      .setFooter({ text: "Bot Monitor • by kamu" });

    await interaction.reply({ embeds: [embed] });
  }
};
