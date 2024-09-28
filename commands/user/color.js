// The meat of the application, this bit I care about and actually wrote myself.

const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");

module.exports = {
	cooldown: 1,
	data: new SlashCommandBuilder()
		.setName("color")
		.setDescription("Generates a 100x100 image with the specified color!")
		.addStringOption((option) =>
			option
				.setName("hexcode")
				.setDescription(
					"Specify the color you want to generate in hexadecimal format."
				)
				.setRequired(true)
				.setMaxLength(6)
				.setMinLength(6)
		)
		.setIntegrationTypes([0, 1]) // Both of these are needed to allow for the bot to function both in guilds and in DMs the bot is not part of.
		.setContexts([0, 1, 2]), // Both of these are needed to allow for the bot to function both in guilds and in DMs the bot is not part of.
	async execute(interaction) {
		// Create a blank 2d canvas that is 100 pixels in width and height.
		const canvas = Canvas.createCanvas(100, 100);
		const context = canvas.getContext("2d");
		const requestedColor = interaction.options
			.getString("hexcode")
			.toUpperCase();

		if (requestedColor.match(/^[0-9a-fA-F]{6}$/)) {
			// Take the users input and use that as the fill color.
			context.fillStyle = "#" + requestedColor;

			// Fill the 100x100 canvas with the above specified color.
			context.fillRect(0, 0, 100, 100);

			// Attatch the file to the response.
			const attachment = new AttachmentBuilder(
				await canvas.encode("png"),
				{
					name: requestedColor + ".png",
				}
			);

			// Send the response.
			interaction.reply({ files: [attachment] });
		} else {
			interaction.reply({
				content:
					"### ERROR: Invalid Hexadecimal Color Code\n\nPlease ensure that the hex code doesn't include a hash `#` and that all characters are within the range of `0-9` and `A-F`.",
				ephemeral: true,
			});
		}
	},
};
