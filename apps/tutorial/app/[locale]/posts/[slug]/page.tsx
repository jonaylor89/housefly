import { CustomMDX } from "app/components/mdx";
import { formatDate, getPosts } from "../../../lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { baseUrl } from "app/lib/utils";

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
  
  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post;
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/posts/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
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
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            description: post.summary,
            image: post.image
              ? `${baseUrl}${post.image}`
              : `/og?title=${encodeURIComponent(post.title)}`,
            url: `${baseUrl}/posts/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Housefly",
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.publishedAt, false, locale)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}