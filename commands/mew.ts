import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const fixedMessage = "🤫🧏";

export default {
  data: new SlashCommandBuilder()
    .setName("mew")
    .setDescription("Make Herrington mew"),
  async execute(interaction: ChatInputCommandInteraction) {
    // Reply with the predefined message
    interaction.reply(fixedMessage);
  },
};
