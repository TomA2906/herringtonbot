const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder().setName("rizz").setDescription("Get some rizz from Herrington"),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const rizz = await axios.get("https://vinuxd.vercel.app/api/pickup");
      const pickupLine = rizz.data.pickup;

      interaction.followUp(pickupLine);
    } catch (error) {
      console.error(error);
      interaction.followUp("No rizz found :( (it's over)");
    }
  }
};
