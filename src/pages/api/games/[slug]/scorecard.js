import dbConnection from "../../../../db/connection";

const objectifyPerson = (containinObj, personKey) => {
  const {
    [`${personKey}Slug`]: slug,
    [`${personKey}Name`]: name,
    [`${personKey}Surname`]: surname,
    ...rest
  } = containinObj;

  return {
    ...rest,
    [personKey]: { slug, name, surname }
  };
};

const objectifyPeople = (containingObj, peopleKeys) => {
  return peopleKeys.reduce(objectifyPerson, containingObj);
};

const objectifyDismissal = perf => {
  const peopled = objectifyPeople(perf, ["bowler", "fielder"]);

  const { dismissal, fielder_position, bowler, fielder, ...rest } = peopled;

  return {
    ...rest,
    dismissal: {
      type: dismissal,
      fielder: {
        ...fielder,
        position: fielder_position
      },
      bowler
    }
  };
};

const objectifyPartnership = ({
  bat1ID,
  bat2ID,
  inningsID,
  batOutID,
  ...pship
}) => {
  const { bat1, bat2, ...rest } = objectifyPeople(pship, ["bat1", "bat2"]);

  return {
    ...rest,
    bat1: {
      ...bat1,
      dismissed: bat1ID === batOutID
    },
    bat2: {
      ...bat2,
      dismissed: bat2ID === batOutID
    }
  };
};

const objectifyInnings = ({
  id,
  teamID,
  teamName,
  teamShortname,
  teamUrl,
  teamSlug,
  ...rest
}) => {
  return {
    ...rest,
    team: {
      name: teamName,
      shortname: teamShortname,
      url: teamUrl,
      slug: teamSlug
    }
  };
};

const objectifyGame = ({
  captainID,
  botmID,
  tossdecision,
  tossWinnerSlug,
  tossWinnerName,
  tossWinnerShortname,
  tossWinnerWebsite,
  ...rest
}) => {
  return {
    ...objectifyPeople(rest, ["captain", "botm"]),
    toss: {
      wonBy: {
        slug: tossWinnerSlug,
        name: tossWinnerName,
        shortname: tossWinnerShortname,
        website: tossWinnerWebsite
      },
      decision: tossdecision
    }
  };
};

export default (req, res) => {
  const {
    query: { slug }
  } = req;

  dbConnection
    .select(
      "games.id",
      "games.captainID",
      "games.botmID",
      "captain.name as captainName",
      "captain.surname as captainSurname",
      "captain.slug as captainSlug",
      "botm.name as botmName",
      "botm.surname as botmSurname",
      "botm.slug as botmSlug"
    )
    .from("games")
    .leftJoin("players as captain", "games.captainID", "captain.id")
    .leftJoin("players as botm", "games.botmID", "botm.id")
    .where("games.slug", slug)
    .andWhere({ "games.deleted_at": null })
    .first()
    .then(gameData => {
      const innings = dbConnection
        .select(
          "innings.id",
          "innings.teamID",
          "innings.innings_no",
          "innings.runs",
          "innings.wickets",
          "innings.overs",
          "innings.extras_noballs",
          "innings.extras_wides",
          "innings.extras_byes",
          "innings.extras_legbyes",
          "innings.extras_pens",
          "innings.declared",
          "teams.name as teamName",
          "teams.shortname as teamShortname",
          "teams.slug as teamSlug",
          "teams.website as teamUrl"
        )
        .from("innings")
        .leftJoin("teams", "innings.teamID", "teams.id")
        .where("innings.gameID", gameData.id)
        .andWhere({ "innings.deleted_at": null });
      const bowlingPerformances = dbConnection
        .select(
          "performance_bowl.inningsID",
          "performance_bowl.balls",
          "performance_bowl.maidens",
          "performance_bowl.runs",
          "performance_bowl.wickets",
          "performance_bowl.wides",
          "performance_bowl.noballs",
          "performance_bowl.highlight",
          "performance_bowl.playerID as playerID",
          "players.name as playerName",
          "players.surname as playerSurname",
          "players.slug as playerSlug"
        )
        .from("performance_bowl")
        .leftJoin("players", "performance_bowl.playerID", "players.id")
        .where("performance_bowl.gameID", gameData.id)
        .andWhere({ "performance_bowl.deleted_at": null });
      const battingPerformances = dbConnection("performance_bat")
        .leftJoin(
          "players as batsman",
          "performance_bat.playerID",
          "batsman.id"
        )
        .leftJoin("players as bowler", "performance_bat.bowlerID", "bowler.id")
        .leftJoin(
          "players as fielder",
          "performance_bat.fielderID",
          "fielder.id"
        )
        .select(
          "performance_bat.runs as runs",
          "performance_bat.inningsID as inningsID",
          "performance_bat.balls as balls",
          "performance_bat.batnumber as batnumber",
          "performance_bat.fours as fours",
          "performance_bat.sixes as sixes",
          "performance_bat.dismissal as dismissal",
          "performance_bat.highlight as highlight",
          "performance_bat.fielder_position as fielder_position",
          "batsman.slug as playerSlug",
          "batsman.name as playerName",
          "batsman.surname as playerSurname",
          "bowler.slug as bowlerSlug",
          "bowler.name as bowlerName",
          "bowler.surname as bowlerSurname",
          "fielder.slug as fielderSlug",
          "fielder.name as fielderName",
          "fielder.surname as fielderSurname"
        )
        .where("performance_bat.gameID", gameData.id)
        .andWhere({ "performance_bat.deleted_at": null })
        .orderBy("performance_bat.batnumber");
      const partnerships = dbConnection
        .select(
          "partnerships.inningsID",
          "partnerships.wicketno",
          "partnerships.batOutID",
          "partnerships.runs",
          "partnerships.bat1ID",
          "partnerships.bat2ID",
          "bat1.name as bat1Name",
          "bat1.surname as bat1Surname",
          "bat1.slug as bat1Slug",
          "bat2.name as bat2Name",
          "bat2.surname as bat2Surname",
          "bat2.slug as bat2Slug"
        )
        .from("partnerships")
        .leftJoin("players as bat1", "partnerships.bat1ID", "bat1.id")
        .leftJoin("players as bat2", "partnerships.bat2ID", "bat2.id")
        .where("partnerships.gameID", gameData.id)
        .andWhere({ "partnerships.deleted_at": null })
        .orderBy("partnerships.wicketno");

      Promise.all([
        innings,
        bowlingPerformances,
        battingPerformances,
        partnerships
      ]).then(([inningsData, bowlingData, battingData, partnershipData]) => {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            ...objectifyGame(gameData),
            //...gameData,
            // opposition: gameData.teams,
            // format: gameData.formats,
            // venue: gameData.venues,
            innings: inningsData.map(inning => ({
              ...objectifyInnings(inning),
              bowlingPerformances: bowlingData
                .filter(perf => perf.inningsID === inning.id)
                .map(({ playerID, inningsID, ...perf }) => {
                  return objectifyPerson(perf, "player");
                }),
              battingPerformances: battingData
                .filter(perf => perf.inningsID === inning.id)
                .map(({ inningsID, ...perf }) => {
                  return objectifyDismissal(objectifyPerson(perf, "player"));
                }),
              partnerships: partnershipData
                .filter(perf => perf.inningsID === inning.id)
                .map(objectifyPartnership)
            }))
          })
        );
      });
    });
};
