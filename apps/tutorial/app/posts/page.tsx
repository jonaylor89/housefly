import { Posts } from "app/components/posts";
import { getPosts } from "./utils";

export const metadata = {
  title: "Housefly",
  description: "Read through the chapters of Housefly",
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Housefly Chapters
      </h1>
      <Posts posts={posts} />
    </section>
  );
}
