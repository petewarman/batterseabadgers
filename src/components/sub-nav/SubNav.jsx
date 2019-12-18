import React from "react";
import classnames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./sub-nav.scss";

const SubNav = ({ links }) => {
  const { asPath } = useRouter();
  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {links.map(({ href, as, text, selected }) => (
          <li key={as} className={styles.listItem}>
            <Link as={as} href={href} scroll={false}>
              <a
                className={classnames(styles.link, {
                  [styles.selected]: selected || asPath === as
                })}
              >
                {text}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubNav;
