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

const GameReport = ({ gameInfo, report, gameSlug }) => {
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
  const {
    slug,
    title,
    content,
    authorName,
    authorSurname,
    publicationDate
  } = report;

  const pageTitle =
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
  const details = `${format.name} at ${venue.name}`;

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
        title={pageTitle}
        subTitle={subTitle}
        details={details}
      />
      {subNavLinks.length > 1 && <SubNav links={subNavLinks} />}
      <Article
        key={slug}
        subTitle={title}
        details={`${dateFormat(
          publicationDate,
          "Do MMMM YYYY"
        )}—by ${authorName} ${authorSurname}`}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Article>
    </>
  );
};

GameReport.getInitialProps = ({ query }) => {
  const { slug, reportSlug } = query;

  return Promise.all([
    axios.get(`http://localhost:3000/api/games/${slug}`),
    axios.get(`http://localhost:3000/api/articles/${reportSlug}`)
  ]).then(([gameInfo, report]) => {
    return { gameInfo: gameInfo.data, report: report.data, gameSlug: slug };
  });
};

export default GameReport;
