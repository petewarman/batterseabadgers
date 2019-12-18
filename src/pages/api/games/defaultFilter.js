import dbConnection from "../../../db/connection";

export default (req, res) => {
  dbConnection("games")
    .select({ "seasons[]": "seasonID" })
    .where({ deleted_at: null })
    .orderBy("seasons[]", "desc")
    .first()
    .then(seasonData => {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify(seasonData));
    });
};
