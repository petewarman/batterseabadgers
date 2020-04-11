import dbConnection from "../../../db/connection";

const config = {
  articles: {
    fieldKeys: ["title", "slug"],
    orderBy: ["title"]
  },
  formats: {
    fieldKeys: ["slug", "name", "innings", "days"],
    orderBy: ["name"]
  },
  pages: {
    fieldKeys: ["slug", "navTitle", "title"],
    orderBy: ["title"]
  },
  players: {
    fieldKeys: ["slug", "name", "surname", "number"],
    orderBy: ["surname", "name"]
  },
  teams: {
    fieldKeys: ["slug", "name", "shortname", "website"],
    orderBy: ["name"]
  },
  venues: {
    fieldKeys: ["name", "slug"],
    orderBy: ["name"]
  },
  awards: {
    fieldKeys: ["award_categories.name", "awards.season_id", "awards,id"],
    joins: [
      { table: "award_categories", foreignKey: "category_id", primaryKey: "id" }
    ],
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
      .select(config[entity].fieldKeys)
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
