import { Posts } from "app/components/posts";
import { getPosts } from "../../lib/utils";
import { getDictionaryForLocale } from "../../i18n/locale";

export default async function PostsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const posts = await getPosts(locale);
  const dictionary = await getDictionaryForLocale(locale);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {dictionary.posts.title}
      </h1>
      <Posts posts={posts} locale={locale} />
    </section>
  );
}