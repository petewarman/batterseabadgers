import dbConnection from "../../../db/connection";

export default (req, res) => {
  const {
    query: { slug }
  } = req;

  dbConnection
    .select(
      "articles.slug",
      "articles.title",
      "articles.published as publicationDate",
      "users.firstname as authorName",
      "users.surname as authorSurname",
      "articles.content"
    )
    .from("articles")
    .leftJoin("users", "articles.author", "users.id")
    .where("articles.slug", slug)
    .andWhere({ "articles.deleted_at": null })
    .andWhere({ "articles.status": "publish" })
    .first()
    .then(data => {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify(data));
    });
};
