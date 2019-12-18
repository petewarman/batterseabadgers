import axios from "axios";

const dataEndpoints = {
  games: "/api/games",
  gamesFilter: "/api/games/filters",
  defaultGamesFilter: "/api/games/defaultFilter",
  players: "/api/players",
  formats: "/api/formats",
  venues: "/api/venues",
  teams: "/api/teams",
  articles: "/api/articles",
  awards: "api/awards",
  users: "api/users"
};

const requestData = (dataType, { slug, ...params } = {}) =>
  axios
    .get(
      `http://localhost:3000${dataEndpoints[dataType]}${
        slug ? `/${slug}` : ""
      }`,
      params
    )
    .then(({ data }) => data);

export default requestData;
