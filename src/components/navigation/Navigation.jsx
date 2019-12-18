import React from "react";
import classnames from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "../../icons/logoSmallWhite";
import Sambrooks from "../../icons/sambrooksWhite";
import styles from "./navigation.scss";

const Navigation = ({ className, defaultGamesFilter }) => {
  const router = useRouter();
  const { pathname } = router;

  const adminLinks = [
    { href: { pathname: "/" }, text: <Logo />, linkClassName: styles.logo },
    { href: { pathname: "/admin/articles" }, text: "Articles" },
    { href: { pathname: "/admin/awards" }, text: "Awards" },
    { href: { pathname: "/admin/formats" }, text: "Formats" },
    { href: { pathname: "/admin/games" }, text: "Games" },
    { href: { pathname: "/admin/players" }, text: "Players" },
    { href: { pathname: "/admin/teams" }, text: "Teams" },
    { href: { pathname: "/admin/venues" }, text: "Venues" }
  ];

  const links = [
    { href: { pathname: "/" }, text: <Logo />, linkClassName: styles.logo },
    { href: { pathname: "/about/[slug]" }, as: "/about/club", text: "About" },
    { href: { pathname: "/games", query: defaultGamesFilter }, text: "Games" },
    { href: { pathname: "/stats" }, text: "Stats" },
    {
      href: {
        pathname:
          "https://seriouscricket.co.uk/teamwear/stores/battersea-badgers-cc"
      },
      text: "Shop"
    }
  ];

  return (
    <nav className={classnames(className, styles.container)}>
      <ul className={styles.list}>
        {(pathname.includes("admin") ? adminLinks : links).map(
          ({ href, text, linkClassName, as }) => (
            <li key={href.pathname} className={styles.listItem}>
              {href.pathname.startsWith("/") ? (
                <Link href={href} as={as}>
                  <a
                    className={classnames(styles.link, linkClassName, {
                      [styles.selected]:
                        pathname.split("?")[0].split("/")[1] ===
                        href.pathname.split("?")[0].split("/")[1]
                    })}
                  >
                    {text}
                  </a>
                </Link>
              ) : (
                <a
                  href={href.pathname}
                  className={classnames(styles.link, linkClassName, {
                    [styles.selected]: `/${pathname.split("/")[1]}` === href
                  })}
                >
                  {text}
                </a>
              )}
            </li>
          )
        )}
      </ul>
      <a className={styles.sponsor} href="http://www.sambrooks.co.uk">
        <Sambrooks />
      </a>
    </nav>
  );
};

export default Navigation;
