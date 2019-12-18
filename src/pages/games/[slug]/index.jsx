import React, { useState, useEffect } from "react";
import axios from "axios";
import classnames from "classnames";

// Components
import Article from "../../../components/article/Article";
import TeamName from "../../../components/team-name/TeamName";
import SubNav from "../../../components/sub-nav/SubNav";

// Utils
import dateFormat from "../../../utils/dateFormat";
import getDismissalConfig from "../../../utils/getDismissalConfig";

// Styles
import styles from "./game-detail.scss";

const isPlayer = ({ name, surname }) =>
  (name || surname) && surname !== "Unknown";

const PlayerName = ({ name, surname, slug, className }) =>
  isPlayer({ name, surname }) ? (
    <a
      href={`/players/${slug}`}
      className={classnames(styles["player-name"], className)}
    >
      {name && <span className={styles.firstname}>{name}</span>}
      {name && <span className={styles.initial}>{name.charAt(0)}</span>}
      {name && surname && " "}
      {surname && <span className={styles.surname}>{surname}</span>}
    </a>
  ) : (
    "unknown"
  );

const DismissalInfo = ({ type, bowler, fielder }) => {
  const config = getDismissalConfig(type);
  const hasBowler = isPlayer(bowler);
  const hasFielder = isPlayer(fielder);

  if (
    !config.abbr ||
    (!hasBowler && config.bowler) ||
    (!hasFielder && !config.bowler && config.fielder)
  ) {
    return type;
  }

  return (
    <>
      <abbr title={type} className={styles.method}>
        {config.abbr}
      </abbr>
      {config.fielder && (
        <>
          {" "}
          <PlayerName {...fielder} />
        </>
      )}
      {config.bowler && config.fielder && (
        <>
          {" "}
          <abbr title="bowled" className={styles.method}>
            b.
          </abbr>
        </>
      )}
      {config.bowler && (
        <>
          {" "}
          <PlayerName {...bowler} />
        </>
      )}
    </>
  );
};

const getExtrasSummary = ({
  extras_wides,
  extras_noballs,
  extras_byes,
  extras_legbyes,
  extras_pens
}) => {
  let summary = [];

  if (extras_wides > 0) {
    summary.push(`${extras_wides}w`);
  }
  if (extras_noballs > 0) {
    summary.push(`${extras_noballs}nb`);
  }
  if (extras_byes > 0) {
    summary.push(`${extras_byes}b`);
  }
  if (extras_legbyes > 0) {
    summary.push(`${extras_legbyes}lb`);
  }
  if (extras_pens > 0) {
    summary.push(`${extras_pens}p`);
  }

  return `Extras${summary.length > 0 ? ` (${summary.join(", ")})` : ""}`;
};

const GameScorecard = ({ scorecard, gameInfo, gameSlug }) => {
  const { innings } = scorecard;
  const {
    host,
    opposition,
    result,
    margin,
    date,
    format,
    venue,
    reports
  } = gameInfo;

  const title =
    host === "home" ? (
      <>
        <TeamName /> vs <TeamName {...opposition} />
      </>
    ) : (
      <>
        <TeamName {...opposition} /> vs <TeamName />
      </>
    );
  const subTitle = `${result} by ${margin}`;
  const details =
    venue.latitude && venue.longitude
      ? `${format.name} at <a target="_blank" rel="noreferrer noopener" href="https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}">${venue.name}</a>`
      : `${format.name} at ${venue.name}`;
  const subNavLinks = [
    {
      as: `/games/${gameSlug}`,
      href: `/games/[slug]`,
      text: "Scorecard"
    }
  ].concat(
    reports.map(({ slug, title }) => ({
      as: `/games/${gameSlug}/${slug}`,
      href: `/games/[slug]/[reportSlug]`,
      text: title
    }))
  );

  return (
    <>
      <Article
        supTitle={dateFormat(date, "dddd Do MMMM YYYY")}
        title={title}
        subTitle={subTitle}
        details={details}
      />
      {subNavLinks.length > 1 && <SubNav links={subNavLinks} />}
      <section id="scorecard" className={styles.scorecard}>
        {innings.map(
          ({
            innings_no,
            team,
            runs,
            wickets,
            overs,
            battingPerformances,
            bowlingPerformances,
            partnerships,
            extras_wides,
            extras_noballs,
            extras_byes,
            extras_legbyes,
            extras_pens
          }) => (
            <div key={innings_no} className={styles.innings}>
              <h3 className={styles.inningsTitle}>
                <span className={styles.inningsTitleTeam}>{team.name}</span>
                <span className={styles.inningsTitleScore}>
                  {runs} for {wickets} ({overs} overs)
                </span>
              </h3>
              <div className={styles.tableHolder}>
                <table className={styles.battingTable}>
                  <thead>
                    <tr>
                      <th className={styles.batTableName}>Name</th>
                      <th className={styles.batTableDismissal}>Dismissal</th>
                      <th className={styles.batTableRuns}>Runs</th>
                      <th className={styles.batTableBalls}>Balls</th>
                      <th className={styles.batTableStrikeRate}>
                        <abbr title="Strike rate">SR</abbr>
                      </th>
                      <th className={styles.batTableFours}>4s</th>
                      <th className={styles.batTableSixes}>6s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {battingPerformances
                      .filter(
                        ({ dismissal }) => dismissal.type !== "Did not bat"
                      )
                      .map(
                        ({
                          batnumber,
                          player,
                          dismissal,
                          runs,
                          balls,
                          fours,
                          sixes
                        }) => (
                          <tr
                            key={batnumber}
                            className={classnames({
                              [styles["not-out"]]: dismissal.type === "Not out"
                            })}
                          >
                            <td className={styles.batTableName}>
                              <PlayerName {...player} />
                            </td>
                            <td className={styles.batTableDismissal}>
                              <DismissalInfo {...dismissal} />
                            </td>
                            <td className={styles.batTableRuns}>{runs}</td>
                            <td className={styles.batTableBalls}>{balls}</td>
                            <td className={styles.batTableStrikeRate}>
                              <abbr title="Strike rate">
                                {balls > 0
                                  ? ((100 * runs) / balls).toFixed(2)
                                  : "-"}
                              </abbr>
                            </td>
                            <td className={styles.batTableFours}>{fours}</td>
                            <td className={styles.batTableSixes}>{sixes}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">
                        {getExtrasSummary({
                          extras_wides,
                          extras_noballs,
                          extras_byes,
                          extras_legbyes,
                          extras_pens
                        })}
                      </td>
                      <td>
                        {extras_wides +
                          extras_noballs +
                          extras_byes +
                          extras_legbyes +
                          extras_pens}
                      </td>
                      <td colSpan="4">&nbsp;</td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        Total ({overs} overs, {wickets} wickets)
                      </td>
                      <td>{runs}</td>
                      <td colSpan="4">&nbsp;</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <ol className={styles.dnb}>
                {battingPerformances
                  .filter(({ dismissal }) => dismissal.type === "Did not bat")
                  .map(({ player, batnumber }) => (
                    <li key={batnumber}>
                      <PlayerName {...player} />
                    </li>
                  ))}
              </ol>
              <ol className={styles.fow}>
                {partnerships
                  .reduce((acc, pship) => {
                    const fowTotal =
                      acc.reduce((a, { runs }) => a + runs, 0) + pship.runs;

                    return acc.concat({ ...pship, fowTotal });
                  }, [])
                  .map(({ wicketno, bat1, bat2, fowTotal }) => {
                    const outBat = [bat1, bat2].find(
                      ({ dismissed }) => dismissed
                    );

                    return (
                      <li key={wicketno}>
                        {fowTotal}/{wicketno} (<PlayerName {...outBat} />)
                      </li>
                    );
                  })}
              </ol>
              <div className={styles.tableHolder}>
                <table className={styles.bowlingTable}>
                  <thead>
                    <tr>
                      <th className={styles.bowlTableName}>name</th>
                      <th className={styles.bowlTableOvers}>
                        <abbr title="Overs">O</abbr>
                      </th>
                      <th className={styles.bowlTableMaidens}>
                        <abbr title="Maidens">M</abbr>
                      </th>
                      <th className={styles.bowlTableRuns}>
                        <abbr title="Runs">R</abbr>
                      </th>
                      <th className={styles.bowlTableWickets}>
                        <abbr title="Wickets">W</abbr>
                      </th>
                      <th className={styles.bowlTableEcon}>
                        <abbr title="Economy">econ</abbr>
                      </th>
                      <th className={styles.bowlTableWides}>
                        <abbr title="Wides">wd</abbr>
                      </th>
                      <th className={styles.bowlTableNoBalls}>
                        <abbr title="No balls">nb</abbr>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bowlingPerformances.map(
                      (
                        {
                          player,
                          balls,
                          maidens,
                          runs,
                          wickets,
                          wides,
                          noballs
                        },
                        i
                      ) => (
                        <tr key={i}>
                          <td className={styles.bowlTableName}>
                            <PlayerName {...player} />
                          </td>
                          <td className={styles.bowlTableOvers}>{balls}</td>
                          <td className={styles.bowlTableMaidens}>{maidens}</td>
                          <td className={styles.bowlTableRuns}>{runs}</td>
                          <td className={styles.bowlTableWickets}>{wickets}</td>
                          <td className={styles.bowlTableEcon}>
                            {balls > 0 ? (runs / (balls / 6)).toFixed(2) : "-"}
                          </td>
                          <td className={styles.bowlTableWides}>{wides}</td>
                          <td className={styles.bowlTableNoBalls}>{noballs}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </section>
    </>
  );
};

GameScorecard.getInitialProps = ({ query }) => {
  const { slug } = query;

  return Promise.all([
    axios.get(`http://localhost:3000/api/games/${slug}`),
    axios.get(`http://localhost:3000/api/games/${slug}/scorecard`)
  ]).then(([gameInfo, scorecard]) => {
    return {
      scorecard: scorecard.data,
      gameInfo: gameInfo.data,
      gameSlug: slug
    };
  });
};

export default GameScorecard;
