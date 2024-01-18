const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Herrington will leak someones profile picture")
    .addUserOption((option) => option.setName("user").setDescription("Who to expose?").setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    const avatarEmbed = {
      color: 0x0099ff,
      title: `${user.tag}'s Profile Picture`,
      image: {
        url: user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })
      }
    };
    await interaction.reply({ embeds: [avatarEmbed] });
  }
};
