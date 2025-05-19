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
  // Get all posts for both locales
  const enPosts = await getPosts('en');
  const ruPosts = await getPosts('ru');
  
  // Create params for English posts
  const enParams = enPosts.map((post) => ({
    locale: 'en',
    slug: post.slug,
  }));
  
  // Create params for Russian posts
  const ruParams = ruPosts.map((post) => ({
    locale: 'ru',
    slug: post.slug,
  }));
  
  // Combine all params
  return [...enParams, ...ruParams];
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  const { locale, slug } = params;
  const posts = await getPosts(locale);
  const post = posts.find((post) => post.slug === slug);
  
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