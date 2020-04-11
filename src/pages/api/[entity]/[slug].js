import db from "../../../db/connection";

const config = {
  awards: {
    fieldKeys: [
      "player_id",
      "category_id",
      "season_id",
      "game_id",
      "description",
      "id"
    ],
    slugField: "id"
  },
  articles: {
    fieldKeys: ["name", "slug", "id"]
  },
  formats: {
    fieldKeys: ["slug", "name", "innings", "days", "id"]
  },
  pages: {
    fieldKeys: ["slug", "title", "subTitle", "content", "id"]
  },
  players: {
    fieldKeys: ["slug", "name", "surname", "number", "id"]
  },
  teams: {
    fieldKeys: ["slug", "name", "shortname", "website", "id"]
  },
  venues: {
    fieldKeys: [
      "slug",
      "name",
      "latitude",
      "longitude",
      "address",
      "region",
      "country",
      "extra",
      "id"
    ]
  }
};

const allowedEntities = Object.keys(config);

function hasValidBody(entity, body) {
  return Object.keys(body).every(bodyKey =>
    config[entity].fieldKeys.includes(bodyKey)
  );
}

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
        db(entity)
          .where(config[entity].slugField || "slug", slug)
          .select(config[entity].fieldKeys)
          .andWhere({ deleted_at: null })
          .first()
          .then(data => {
            // res.setHeader("Content-Type", "application/json");
            res.status(200).json(data);
          });
        break;
      case "POST":
        if (!hasValidBody(entity, body)) {
          res.status(400).json({
            status: 400,
            message: `Unexpected property in request body`
          });
          break;
        }
        db(entity)
          .insert(body)
          .then(() => {
            res.status(204).end();
          });
      case "PUT":
        if (!hasValidBody(entity, body)) {
          res.status(400).json({
            status: 400,
            message: `Unexpected property in request body`
          });
          break;
        }
        db(entity)
          .where("id", body.id)
          .update({ ...body, updated_at: db.fn.now() })
          .then(() => {
            res.status(204).end();
          });
        break;
      case "DELETE":
        if (!hasValidBody(entity, body)) {
          res.status(400).json({
            status: 400,
            message: `Unexpected property in request body`
          });
          break;
        }
        db(entity)
          .where("id", body.id)
          .update({ deleted_at: db.fn.now() })
          .then(() => {
            res.status(204).end();
          });
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "POST", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
};
