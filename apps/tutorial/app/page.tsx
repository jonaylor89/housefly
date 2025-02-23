import { Posts } from "app/components/posts";
import { getPosts } from "./posts/utils";

export default async function Page() {
  const posts = await getPosts();

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">Housefly</h1>
      <p className="mb-4">
        Web scraping is an essential skill for developers, but learning it can
        be tricky. That’s why I created <strong>Housefly</strong>, a hands-on
        project designed to teach web scraping through interactive exercises.
        Inspired by Google Gruyere, Housefly provides a series of small
        tutorials with dedicated companion websites built <em>to be scraped</em>
        . The goal? To give you a safe, structured environment to practice and
        refine your scraping skills.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Why Did I Make This?</h2>
      <p className="mb-4">
        I’ve seen countless tutorials that explain web scraping in theory, but
        very few offer real, controlled environments to experiment in. Housefly
        solves that by providing self-contained challenges where you scrape
        provided websites and verify your solutions against expected outputs.
        It’s built for hands-on learners who want to <em>do</em> rather than
        just <em>read</em>.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">How to Get Started</h2>
      <p className="mb-4">
        Instructions are in the README.md file of the GitHub repository. From
        there, you can follow the steps to set up and run the project.
      </p>

      <div className="my-8">
        <Posts posts={posts} />
      </div>
    </section>
  );
}
