import dbConnection from "../../../db/connection";

const config = {
  articles: {
    select: ["name", "slug"]
  },
  formats: {
    select: ["slug", "name", "innings", "days"]
  },
  pages: {
    select: ["slug", "title", "subTitle", "content"]
  },
  players: {
    select: ["slug", "name", "surname", "number"]
  },
  teams: {
    select: ["slug", "name", "shortname", "website"]
  },
  venues: {
    select: [
      "slug",
      "name",
      "latitude",
      "longitude",
      "address",
      "region",
      "country",
      "extra"
    ]
  }
};

const allowedEntities = Object.keys(config);

export default (req, res) => {
  const {
    query: { slug, entity },
    body,
    method
  } = req;

  if (!allowedEntities.includes(entity)) {
    res.status(404).end(`Not found`);
  } else {
    switch (method) {
      case "GET":
        dbConnection(entity)
          .where("slug", slug)
          .select(config[entity].select)
          .andWhere({ deleted_at: null })
          .first()
          .then(data => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).end(JSON.stringify(data));
          });
        break;
      case "PUT":
        break;
      case "DELETE":
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
};
