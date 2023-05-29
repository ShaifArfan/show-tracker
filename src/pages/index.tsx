import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import prisma from "@/lib/prisma";

type Props = {
  shows: any;
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <h1>Hello worldl</h1>
      {JSON.stringify(props.shows, null, 2)}
      {/* <div>
        <h1>My Blog</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className={styles.post}>
              <Post post={post} />
            </div>
          ))}
        </main>
      </div> */}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const shows = await prisma.show.findMany({
    include: { episodes: true },
  });
  return {
    props: { shows },
  };
};

export default Blog;
