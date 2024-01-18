import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Creates a poll")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title to use for the poll")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription(
          "Options for the poll, separated by commas (e.g., option1, option2, option3)"
        )
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString("title");
    const optionsString = interaction.options.getString("options");

    if (!title || !optionsString) {
      return interaction.reply("Please provide a title and options for the poll.");
    }

    const options = optionsString.split(",").map((option) => option.trim());

    if (options.length < 2 || options.length > 9) {
      return interaction.reply("Please provide between 2 and 9 options for the poll.");
    }

    const optionEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

    const embed = {
      color: 0x0099ff,
      title: `Poll: ${title}`,
      description: options.map((option, index) => `${optionEmojis[index]}: ${option}`).join("\n"),
    };

    try {
      const pollMessage = await interaction.reply({
        embeds: [embed],
        fetchReply: true, // Explicitly specify fetchReply property
      });

      // React with number emojis based on the number of options
      for (let i = 0; i < options.length; i++) {
        await pollMessage.react(optionEmojis[i]);
      }
    } catch (error) {
      console.error("Error replying to poll command:", error);
      interaction.reply("An error occurred while creating the poll.");
    }
  },
};
