import fs from "fs";
import path from "path";
import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.BOT_TOKEN;
const guildId = process.env.GUILD_ID; // untuk testing per guild (lebih cepat)

if (!token) {
  console.error("TOKEN tidak ditemukan. Isi .env BOT_TOKEN");
  process.exit(1);
}

// client hanya butuh Guilds intent untuk slash commands / guild info
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// load commands
client.commands = new Collection();
const commands = [];
const commandsPath = path.join("commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandModule = await import(`./${filePath}`);
  const command = commandModule.default;
  client.commands.set(command.name, command);
  // untuk register ke discord (name + description)
  commands.push({
    name: command.name,
    description: command.description
  });
}

// register commands ke guild (cepat, immediate)
const rest = new REST({ version: "10" }).setToken(token);
if (!guildId) {
  console.warn("GUILD_ID kosong. Jika mau register guild-scoped commands untuk cepat testing, isi GUILD_ID.");
}
try {
  if (guildId) {
    console.log("Mendaftarkan commands ke guild:", guildId);
    await rest.put(
      Routes.applicationGuildCommands((await rest.get(Routes.oauth2CurrentApplication())).id, guildId),
      { body: commands }
    );
  } else {
    // fallback: register global (mungkin butuh waktu)
    const appIdRes = await rest.get(Routes.oauth2CurrentApplication());
    await rest.put(Routes.applicationCommands(appIdRes.id), { body: commands });
  }
  console.log("Commands terdaftar.");
} catch (err) {
  console.error("Gagal register command:", err);
}

// event ready
client.once("ready", () => {
  console.log(`Bot siap: ${client.user.tag}`);
});

// handle interaction
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return interaction.reply({ content: "Command tidak ditemukan.", ephemeral: true });
  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error("Error menjalankan command:", err);
    if (interaction.replied || interaction.deferred) {
      interaction.editReply({ content: "Terjadi error saat menjalankan command." });
    } else {
      interaction.reply({ content: "Terjadi error saat menjalankan command.", ephemeral: true });
    }
  }
});

client.login(token);