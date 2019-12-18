import React from "react";
import styles from "./team-name.scss";

const TeamName = ({ name, shortname, className }) =>
  shortname && shortname !== name ? (
    <span className={className}>
      <abbr title={name} className={styles.short}>
        {shortname}
      </abbr>

      <span className={styles.full}>{name}</span>
    </span>
  ) : (
    <span className={className}>{name}</span>
  );

TeamName.defaultProps = {
  name: "Battersea Badgers",
  shortname: "Badgers",
  className: undefined
};

export default TeamName;
