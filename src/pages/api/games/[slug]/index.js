import dbConnection from "../../../../db/connection";

const formatGame = (
  {
    oppoSlug,
    oppoName,
    oppoShortname,
    oppoWebsite,
    venueName,
    latitude,
    longitude,
    address,
    venueSlug,
    formatSlug,
    formatName,
    formatInnings,
    formatDays,
    ...rest
  } = {},
  reports = []
) => {
  return {
    ...rest,
    opposition: {
      name: oppoName,
      shortname: oppoShortname,
      slug: oppoSlug,
      url: oppoWebsite
    },
    venue: {
      name: venueName,
      latitude,
      longitude,
      address,
      slug: venueSlug
    },
    format: {
      slug: formatSlug,
      name: formatName,
      innings_count: formatInnings,
      days: formatDays
    },
    reports
  };
};

export default (req, res) => {
  const {
    query: { slug }
  } = req;

  dbConnection
    .select(
      "games.id",
      "games.host",
      "games.date",
      "games.timezone",
      "games.result",
      "games.margin",
      "games.tossdecision",
      "opposition.slug as oppoSlug",
      "opposition.name as oppoName",
      "opposition.shortname as oppoShortname",
      "opposition.website as oppoWebsite",
      "venues.name as venueName",
      "venues.latitude",
      "venues.longitude",
      "venues.address",
      "venues.slug as venueSlug",
      "formats.slug as formatSlug",
      "formats.name as formatName",
      "formats.innings as formatInnings",
      "formats.days as formatDays"
    )
    .from("games")
    .leftJoin("teams as opposition", "games.oppositionID", "opposition.id")
    .leftJoin("teams as tosswinners", "games.tosswonby", "tosswinners.id")
    .leftJoin("venues", "games.venueID", "venues.id")
    .leftJoin("formats", "games.formatID", "formats.id")
    .where("games.slug", slug)
    .andWhere({ "games.deleted_at": null })
    .first()
    .then(gameData => {
      const reports = dbConnection
        .select("articles.title", "articles.slug")
        .from("article_game")
        .leftJoin("articles", "article_game.article_id", "articles.id")
        .where("article_game.game_id", gameData.id)
        .andWhere({ "articles.status": "publish" });

      reports.then(reportsData => {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            ...formatGame(gameData, reportsData)
          })
        );
      });
    });
};
