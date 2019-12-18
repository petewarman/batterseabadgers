import React from "react";

// Components
import Logo from "../icons/logo";

// Styles
import styles from "./index.scss";

const Home = () => (
  <div className={styles.container}>
    <Logo className={styles.logo} />
  </div>
);

export default Home;
