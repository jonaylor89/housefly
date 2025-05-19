import { Posts } from "app/components/posts";
import { getPosts } from "../../lib/utils";

export default async function PostsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const posts = await getPosts(locale);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {locale === 'en' ? 'Posts' : 'Статьи'}
      </h1>
      <Posts posts={posts} locale={locale} />
    </section>
  );
}