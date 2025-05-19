import { CustomMDX } from "app/components/mdx";
import { getPosts } from "../../../posts/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PostParams = {
  params: {
    locale: string;
    slug: string;
  };
};

export async function generateStaticParams() {
  // Get all posts available
  const posts = await getPosts();
  // Return params for each post with both locales
  return posts.flatMap((post) => [
    {
      locale: 'en',
      slug: post.slug,
    },
    {
      locale: 'ru',
      slug: post.slug,
    },
  ]);
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  const posts = await getPosts();
  const post = posts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {};
  }
  
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: PostParams) {
  const { locale, slug } = params;
  const posts = await getPosts(locale);
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{post.title}</h1>
      <div className="mb-8">
        <CustomMDX source={post.content} />
      </div>
    </section>
  );
}