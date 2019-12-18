import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

// Components
import Link from "next/link";
import TeamName from "../../components/team-name/TeamName";
import MultiSelect from "../../components/multi-select/MultiSelect";

// Utils
import dateFormat from "../../utils/dateFormat";
import requestData from "../../utils/requestData";

// Styles
import styles from "./game-list.scss";

const groupGamesByMonth = games => {
  return games.reduce((acc, game) => {
    const monthString = dateFormat(game.date, "MMMM YYYY");
    if (!acc[monthString]) {
      acc[monthString] = [];
    }
    acc[monthString].push(game);
    return acc;
  }, {});
};

const formatQuery = query =>
  Object.entries(query).reduce(
    (acc, [key, val]) => ({
      ...acc,
      [key.replace("[]", "")]: val
    }),
    {}
  );

const omit = (key, obj) => {
  const { [key]: omitted, ...rest } = obj;
  return rest;
};

const GameList = ({ gameGroups = {}, filters = [] }) => {
  const router = useRouter();
  const [groups, setGroups] = useState(gameGroups);
  const { query, pathname } = router;

  const handleFilterChange = (name, selectedItems = []) => {
    const updatedQuery =
      selectedItems.length > 0
        ? {
            ...query,
            [name]: selectedItems
          }
        : omit(name, query);

    router.push(
      {
        pathname,
        query: updatedQuery
      },
      {
        pathname,
        query: updatedQuery
      },
      { shallow: true }
    );
  };

  useEffect(() => {
    requestData("games", {
      params: formatQuery(query)
    }).then(gameData => {
      setGroups(groupGamesByMonth(gameData.games));
    });
  }, [query]);

  return (
    <>
      <h1 className={styles.pageTitle}>Games</h1>
      <form className={styles.filter}>
        <h2 className={styles.filterTitle}>Filter</h2>
        {filters.map(filter => (
          <MultiSelect
            {...filter}
            selected={query[filter.name]}
            key={filter.title}
            onChange={handleFilterChange}
            className={styles.filterItem}
          />
        ))}
      </form>
      <ol className={styles.groupList}>
        {Object.keys(groups).map(groupKey => (
          <li key={groupKey} className={styles.groupListItem}>
            <h2 className={styles.groupTitle}>{groupKey}</h2>
            <ol className={styles.gameList}>
              {groups[groupKey].map(
                ({ date, slug, result, margin, name, shortname }) => (
                  <li key={slug} className={styles.gameListItem}>
                    <Link href="games/[slug]" as={`/games/${slug}`}>
                      <a className={styles.link}>
                        <span className={styles.fullDate}>
                          {dateFormat(date, "ddd Do MMM")}
                        </span>
                        <span className={styles.shortDate}>
                          {dateFormat(date, "Do MMM")}
                        </span>
                        <TeamName
                          className={styles.team}
                          name={name}
                          shortname={shortname}
                        />
                        {result !== "0" && (
                          <span className={styles.extra}>
                            <span className={styles.result}>{result}</span>
                            {margin && (
                              <span className={styles.margin}>{margin}</span>
                            )}
                          </span>
                        )}
                      </a>
                    </Link>
                  </li>
                )
              )}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
};

GameList.getInitialProps = ({ query }) => {
  console.log("getInitialProps query", query);

  return Promise.all([
    requestData("games", {
      params: formatQuery(query)
    }),
    requestData("gamesFilter")
  ]).then(([gameData, filterData]) => {
    return {
      gameGroups: groupGamesByMonth(gameData.games),
      filters: filterData
    };
  });
};

export default GameList;
