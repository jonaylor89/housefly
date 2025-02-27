export const metadata = {
  title: "Housefly - How to Get Started",
  description: "Learn how to get started with Housefly",
};

export default function HowToPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        How to Get Started
      </h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Clone the Repository</h2>
      <pre>
        <code>
          {`git clone https://github.com/jonaylor89/housefly.git && cd housefly`}
        </code>
      </pre>

      <h2 className="text-xl font-semibold mt-6 mb-2">Navigate to Chapter 1</h2>
      <p>
        Each chapter contains a simple website to scrape, along with an
        expected.txt file defining the correct output.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Write Your Scraper</h2>
      <p>
        Implement your solution inside the corresponding solution[number]/
        directory.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Check Your Answer</h2>
      <p>
        Run the validation script to compare your scraper&apos;s output against
        expected.txt:
      </p>
      <pre>
        <code>npm run ca 1</code>
      </pre>
    </div>
  );
}
