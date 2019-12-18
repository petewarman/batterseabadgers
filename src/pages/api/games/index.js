import dbConnection from "../../../db/connection";
import qs from "qs";

const filterMap = {
  seasons: "games.seasonID",
  opposition: "teams.slug",
  formats: "formats.slug",
  venues: "venues.slug"
};

const sanitiseQueryObject = queryObj => {
  const allowedKeys = Object.keys(filterMap);

  return Object.entries(queryObj).reduce((acc, [key, value]) => {
    if (allowedKeys.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export default (req, res) => {
  const queryString = req.url.split("?")[1];
  const queryObj = sanitiseQueryObject(qs.parse(queryString));

  dbConnection("games")
    .leftJoin("teams", "games.oppositionID", "teams.id")
    .leftJoin("formats", "games.formatID", "formats.id")
    .leftJoin("venues", "games.venueID", "venues.id")
    .select(
      "games.date",
      "games.slug",
      "games.result",
      "games.margin",
      "teams.name",
      "teams.shortname"
    )
    .where(builder => {
      Object.entries(queryObj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          builder.whereIn(filterMap[key], value);
        } else {
          builder.where(filterMap[key], value);
        }
      });
    })
    .andWhere({ "games.deleted_at": null })
    .then(data => {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify({ games: data }));
    })
    .catch(console.log);
};
