import { CustomMDX } from "app/components/mdx";

export const metadata = {
  title: "Housefly - How to Get Started",
  description: "Learn how to get started with Housefly",
};

const content = `
# How to Get Started

## Clone the Repository

Clone the repository using the following command:

\`\`\`sh
git clone https://github.com/jonaylor89/housefly.git
cd housefly
\`\`\`

## Navigate to Chapter 1

Each chapter contains a simple website to scrape, along with an expected.txt file defining the correct output.

## Write Your Scraper

Implement your solution inside the corresponding \`solution[number]/\` directory.
`;

export default async function HowToPage() {
  return (
    <section>
      <article className="prose">
        <CustomMDX source={content} />
      </article>
    </section>
  );
}
