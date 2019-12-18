import dbConnection from "../../../db/connection";

const config = {
  articles: {
    select: ["title", "slug"],
    orderBy: ["title"]
  },
  formats: {
    select: ["slug", "name", "innings", "days"],
    orderBy: ["name"]
  },
  pages: {
    select: ["slug", "navTitle", "title"],
    orderBy: ["title"]
  },
  players: {
    select: ["slug", "name", "surname", "number"],
    orderBy: ["surname", "name"]
  },
  teams: {
    select: ["slug", "name", "shortname", "website"],
    orderBy: ["name"]
  },
  venues: {
    select: ["name", "slug"],
    orderBy: ["name"]
  },
  awards: {
    select: ["player_id", "category_id", "season_id"],
    orderBy: ["season_id", "category_id"]
  }
};

const allowedEntities = Object.keys(config);

export default (req, res) => {
  const {
    query: { entity },
    method
  } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } else if (!allowedEntities.includes(entity)) {
    res.status(404).end(`Not found`);
  } else {
    dbConnection
      .select(config[entity].select)
      .from(entity)
      .where({ deleted_at: null })
      .orderBy(config[entity].orderBy)
      .then(data => {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(data));
      });
  }
};
