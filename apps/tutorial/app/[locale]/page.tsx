import { Posts } from "app/components/posts";
import { getPosts } from "../posts/utils";
import Link from "next/link";
import { getDictionaryForLocale } from "../i18n/locale";

export default async function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const posts = await getPosts(locale);
  const dictionary = await getDictionaryForLocale(locale);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{dictionary.home.heading}</h1>
      <p className="mb-4">
        {dictionary.home.intro}
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">{dictionary.home.whyCreated.title}</h2>
      <p className="mb-4">
        {dictionary.home.whyCreated.content}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">{dictionary.home.getStarted.title}</h2>
      <p className="mb-4">
        {dictionary.home.getStarted.content.split('README.md')[0]}
        <Link href="https://github.com/jonaylor89/housefly">README.md</Link>
        {dictionary.home.getStarted.content.split('README.md')[1]}
      </p>

      <div className="my-8">
        <Posts posts={posts} locale={locale} />
      </div>
    </section>
  );
}