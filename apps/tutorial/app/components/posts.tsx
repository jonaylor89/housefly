import Link from "next/link";
import { formatDate } from "app/lib/utils";

type Post = {
  title: string;
  summary: string;
  publishedAt: string;
  slug: string;
  content: string;
};

export function Posts({
  posts,
  locale = 'en',
}: {
  posts: Post[];
  locale?: string;
}) {
  
  return (
    <div>
      {posts
        .sort((a, b) => {
          if (
            new Date(a.publishedAt) > new Date(b.publishedAt)
          ) {
            return 1;
          }
          return -1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/${locale}/posts/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[125px] tabular-nums">
                {formatDate(post.publishedAt, false, locale)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
