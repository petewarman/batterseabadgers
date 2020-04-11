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
  awards: "/api/awards",
  users: "/api/users"
};

const requestData = (dataType, { slug, ...params } = {}) => {
  if (!dataEndpoints[dataType]) {
    return;
  }
  return axios
    .get(
      `http://localhost:3000${dataEndpoints[dataType]}${
        slug ? `/${slug}` : ""
      }`,
      params
    )
    .then(({ data }) => data);
};

export const createData = (dataType, data) =>
  axios
    .post(`http://localhost:3000${dataEndpoints[dataType]}`, data)
    .then(({ data }) => data);

export const updateData = (dataType, slug, data) =>
  axios
    .put(`http://localhost:3000${dataEndpoints[dataType]}/${slug}`, data)
    .then(({ data }) => data);

export const deleteData = (dataType, slug, data) =>
  axios
    .delete(`http://localhost:3000${dataEndpoints[dataType]}/${slug}`, data)
    .then(({ data }) => data);

export default requestData;
