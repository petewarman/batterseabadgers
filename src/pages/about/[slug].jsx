import React from "react";
import axios from "axios";
import Article from "../../components/article/Article";
import SubNav from "../../components/sub-nav/SubNav";

const AboutSubPage = ({ pages, pageDetail }) => {
  return (
    <>
      <SubNav
        links={pages.map(({ navTitle, title, slug }) => ({
          as: `/about/${slug}`,
          text: navTitle || title,
          href: `/about/[slug]`
        }))}
      />
      <Article title={pageDetail.title} subTitle={pageDetail.subTitle}>
        <div dangerouslySetInnerHTML={{ __html: pageDetail.content }} />
      </Article>
    </>
  );
};

AboutSubPage.getInitialProps = ({ query }) => {
  const { slug } = query;

  return Promise.all([
    axios.get(`http://localhost:3000/api/pages`),
    axios.get(`http://localhost:3000/api/pages/${slug}`)
  ]).then(([pages, pageDetail]) => {
    return {
      pages: pages.data,
      pageDetail: pageDetail.data
    };
  });
};

export default AboutSubPage;
