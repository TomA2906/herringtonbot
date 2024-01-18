import axios from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { i18n } from "../utils/i18n";

export default {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription(i18n.__("meme.description")),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const res = await axios.get("https://meme-api.com/gimme/1");
      if (res.data.memes[0]?.url) {
        interaction.reply(res.data.memes[0].url);
      } else {
        interaction.reply("No epic funny meme found :(");
      }
    } catch (error) {
      console.error("Error fetching meme:", error);
      interaction.reply("An error occurred while fetching the meme.");
    }
  },
};
