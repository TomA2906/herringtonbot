const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Herrington will purge a specific number of messages")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Number of messages to delete").setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user invoking the command is an administrator
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply("Skill issue.");
    }

    // Get the number of messages to delete from the user's input
    const amount = interaction.options.getInteger("amount");

    // Check if the amount is within a valid range (1 to 100)
    if (amount < 1 || amount > 100) {
      return interaction.reply("Please provide a number between 1 and 100 buddy.");
    }

    try {
      // Fetch and delete the specified number of messages in the channel
      const messages = await interaction.channel.messages.fetch({
        limit: amount
      });
      await interaction.channel.bulkDelete(messages);

      // Reply to the user indicating that the messages have been deleted
      const reply = await interaction.reply(`Successfully deleted ${amount} messages lil bro.`);

      // Delay the deletion of the reply message for 3 seconds
      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 3000);
    } catch (error) {
      console.error("L rizz when deleting messages:", error);
      interaction.reply("I fumbled the deleting messages.");
    }
  }
};
