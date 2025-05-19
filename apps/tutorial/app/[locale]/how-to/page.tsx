import { CustomMDX } from "app/components/mdx";
import { getDictionaryForLocale } from "../../i18n/locale";

type HowToPageProps = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({ params }: HowToPageProps) {
  const dictionary = await getDictionaryForLocale(params.locale);
  
  return {
    title: dictionary.howTo.title,
    description: dictionary.howTo.description,
  };
}

export default async function HowToPage({ params: { locale } }: HowToPageProps) {
  const dictionary = await getDictionaryForLocale(locale);
  const { content } = dictionary.howTo;
  
  // Construct the markdown content using the dictionary
  const markdownContent = `
# ${content.heading}

## ${content.cloneRepo.title}

${content.cloneRepo.description}

\`\`\`sh
git clone https://github.com/jonaylor89/housefly.git
cd housefly
\`\`\`

## ${content.chapter1.title}

${content.chapter1.description}

## ${content.writeScraper.title}

${content.writeScraper.description}
`;

  return (
    <section>
      <article className="prose">
        <CustomMDX source={markdownContent} />
      </article>
    </section>
  );
}