import React from "react";
import styles from "./article.module.scss";

const Article = ({ title, supTitle, subTitle, details, children }) => (
  <article className={styles.container}>
    <header className={styles.header}>
      {supTitle && <h2 className={styles.supTitle}>{supTitle}</h2>}
      {title && <h1 className={styles.title}>{title}</h1>}
      {subTitle && <h2 className={styles.subTitle}>{subTitle}</h2>}
      {details && (
        <p
          className={styles.details}
          dangerouslySetInnerHTML={{ __html: details }}
        />
      )}
    </header>
    {children && <div className={styles.content}>{children}</div>}
  </article>
);

export default Article;
