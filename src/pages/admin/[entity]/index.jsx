import React from "react";
import classnames from "classnames";

// utils
import requestData from "../../../utils/requestData";

// styles
import styles from "./list.scss";

const getEntityDescriptor = (entity, item) => {
  switch (entity) {
    case "players":
      return `${item.surname}, ${item.name}`;
    case "awards":
      return item.player_id;
    case "formats":
    case "venues":
      return item.name;
    case "articles":
      return item.title;
    default:
      return item.slug;
  }
};

export const List = ({ items, entity, selected, className }) => (
  <ul className={classnames(styles.list, className)}>
    {items.map(item => (
      <li key={item.slug} className={styles.listItem}>
        <a
          href={`/admin/${entity}/${item.slug}`}
          className={classnames(styles.link, {
            [styles.selectedLink]: selected && selected.slug === item.slug
          })}
        >
          {getEntityDescriptor(entity, item)}
        </a>
      </li>
    ))}
  </ul>
);

const EntityList = props => <List {...props} />;

EntityList.getInitialProps = ({ query }) => {
  const { entity } = query;

  return requestData(entity).then(res => {
    return {
      entity,
      items: res
    };
  });
};

export default EntityList;
