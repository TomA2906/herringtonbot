const { SlashCommandBuilder } = require("@discordjs/builders");
const { InteractionReplyOptions } = require("discord.js");
const { request } = require("undici");
const cacheData = require("memory-cache");

async function fetchWithCache(url) {
  const value = cacheData.get(url);
  if (value) {
    return value;
  } else {
    const hours = 24;
    const res = await request(url);
    const json = await res.body.json();
    cacheData.put(url, { statusCode: res.statusCode, json }, hours * 1000 * 60 * 60);
    return { statusCode: res.statusCode, json };
  }
}

const rand = (items) => items[(items.length * Math.random()) | 0];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getSorts() {
  const { json, statusCode } = await fetchWithCache("https://games.roblox.com/v1/games/sorts");
  if (statusCode !== 200) return false;
  return json.sorts.map((sort) => sort.token);
}

async function getUniverseId(universeId) {
  const { body, statusCode } = await request(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
  const json = await body.json();
  if (statusCode !== 200) {
    return false;
  }
  return json.data[0];
}

async function getImage(universeId) {
  const { json, statusCode } = await fetchWithCache(
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=150x150&format=Png&isCircular=false`
  );
  if (statusCode !== 200) return false;
  return json.data[0].imageUrl;
}

async function getPlayable(universeId) {
  const { body, statusCode } = await request(
    `https://games.roblox.com/v1/games/multiget-playability-status?universeIds=${universeId}`
  );
  if (statusCode !== 200) return false;
  const json = await body.json();
  return json[0].playabilityStatus === "GuestProhibited";
}

async function getTrulyRandomGame() {
  let successGame = undefined;

  const gamesList = Array.from({ length: 50 }, () => getUniverseId(randomIntFromInterval(1, 8915048233).toString()));

  const games = await Promise.all(gamesList);

  for (const game of games) {
    if (game) {
      if (!game.name.includes("Place")) {
        const playable = await getPlayable(game.id.toString());
        if (playable) {
          const imageUrl = await getImage(game.id);
          successGame = {
            name: game.name,
            creatorName: game.creator.name,
            price: game.price,
            desc: game.description,
            universeId: game.id,
            placeId: game.rootPlaceId,
            image: imageUrl
          };
        }
      }
    }
  }
  if (!successGame) return getTrulyRandomGame();

  return successGame;
}

const randomGameCommand = new SlashCommandBuilder()
  .setName("roblox")
  .setDescription("Herrington finds a random Roblox game.");

module.exports = {
  data: randomGameCommand,
  async execute(interaction) {
    const popular = interaction.options.getBoolean("popular");

    if (popular) {
      const sorts = await getSorts();
      if (!sorts) return respondError(interaction);

      const categories = await Promise.all(
        sorts.map(async (sort) => {
          const params = new URLSearchParams({
            "model.sortToken": sort
          }).toString();

          let { statusCode, json } = await fetchWithCache(`https://games.roblox.com/v1/games/list?${params}`);
          if (statusCode !== 200) return;

          const games = json.games.map((game) => ({
            name: game.name,
            creatorName: game.creatorName,
            price: game.price,
            desc: game.gameDescription,
            imageToken: game.imageToken,
            universeId: game.universeId,
            placeId: game.placeId,
            totalUpVotes: game.totalUpVotes,
            totalDownVotes: game.totalDownVotes
          }));
          return games;
        })
      );

      const rawGame = categories
        .filter(Boolean)
        .flatMap((category) => category)
        .flat();
      const imageUrl = await getImage(rawGame.universeId);
      const game = { ...rawGame, image: imageUrl };

      return respond(interaction, game);
    } else {
      const game = await getTrulyRandomGame();
      return respond(interaction, game);
    }
  }
};

async function respond(interaction, gameInfo) {
  try {
    // Constructing a simple text message
    const formattedContent =
      `**Name:** ${gameInfo.name}\n` +
      `**Creator:** ${gameInfo.creatorName}\n` +
      `**Description:** ${gameInfo.desc}\n` +
      `**Play Game:** [${gameInfo.name}](https://www.roblox.com/games/${gameInfo.placeId})`;

    // Reply to the interaction with the formatted content
    await interaction.reply(formattedContent);
  } catch (error) {
    console.error("Roblox is being a goofy again:", error);
  }
}

function respondError(interaction) {
  const response = new InteractionReplyOptions().setContent("Roblox is being a goofy again.").setAllowedMentions({
    repliedUser: false
  });

  interaction.reply(response);
}
