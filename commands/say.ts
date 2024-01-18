import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make Herrington say a message")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want Herrington to say")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    // Retrieve the message from the user's input
    const messageToSay = interaction.options.getString("message");

    // Reply with the specified message
    interaction.reply(`${messageToSay}`);
  },
};
