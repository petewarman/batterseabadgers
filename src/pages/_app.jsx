import React from "react";
import App from "next/app";

// Components
import Navigation from "../components/navigation/Navigation";

// Utils
import requestData from "../utils/requestData";

// Styles
import styles from "./app.scss";

class MyApp extends App {
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    const defaultGamesFilter = await requestData("defaultGamesFilter");

    return { ...appProps, defaultGamesFilter };
  }

  render() {
    const { Component, pageProps, defaultGamesFilter } = this.props;

    return (
      <>
        <Navigation
          className={styles.nav}
          defaultGamesFilter={defaultGamesFilter}
        />
        <main className={styles.main}>
          <Component {...pageProps} />
        </main>
      </>
    );
  }
}

export default MyApp;
