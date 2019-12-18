import dbConnection from "../../../db/connection";

export default (req, res) => {
  Promise.all([
    dbConnection("games")
      .distinct("seasonID")
      .where({ deleted_at: null })
      .orderBy("seasonID", "desc"),
    dbConnection("teams")
      .select("slug", "name", "shortname")
      .whereNotIn("slug", ["badgers", "all", "tbc"])
      .where({ deleted_at: null })
      .orderBy("name"),
    dbConnection("formats")
      .select("slug", "name")
      .where({ deleted_at: null })
      .orderBy("name"),
    dbConnection("venues")
      .select("slug", "name", "region", "country")
      .where({ deleted_at: null })
      .orderBy("name")
  ]).then(([seasonData, oppoData, formatData, venueData]) => {
    const filters = [
      {
        title: "Seasons",
        name: "seasons[]",
        options: seasonData.map(({ seasonID }) => ({
          label: seasonID.toString(),
          value: seasonID.toString()
        }))
      },
      {
        title: "Opposition",
        name: "opposition[]",
        options: oppoData.map(({ slug, name, shortname }) => ({
          abbr: shortname,
          label: name,
          value: slug
        }))
      },
      {
        title: "Formats",
        name: "formats[]",
        options: formatData.map(({ slug, name }) => ({
          label: name,
          value: slug
        }))
      },
      {
        title: "Venues",
        name: "venues[]",
        options: venueData.map(({ slug, name, region, country }) => ({
          label: name,
          value: slug,
          region,
          country
        }))
      }
    ];

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(filters));
  });
};

// [
//     {
//       title: "Seasons",
//       name: "seasons[]",
//       options: [
//         { label: "2019", value: "2019" },
//         { label: "2018", value: "2018" },
//         { label: "2017", value: "2017" }
//       ]
//     },
//     {
//       title: "Opposition",
//       name: "opposition[]",
//       options: [
//         { label: "Seveno", value: "seveno" },
//         { label: "Thespsian Thunderers", value: "thesps" },
//         { label: "Addiscombe", value: "addiscombe" }
//       ]
//     }
//   ]
