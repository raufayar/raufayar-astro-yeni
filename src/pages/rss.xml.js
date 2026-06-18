import rss from '@astrojs/rss';

export async function GET(context) {
  // src/pages/ altındaki tüm .md ve .mdx uzantılı markdown yazılarını tarar
  const postImportResult = import.meta.glob('./**/*.{md,mdx}', { eager: true });
  const posts = Object.values(postImportResult);

  // Yazıları en yeni tarihe göre sıralar
  const sortedPosts = posts.sort((a, b) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate));

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://raufayar.net',
    items: sortedPosts.map((post) => ({
      title: post.frontmatter.title,
      pubDate: new Date(post.frontmatter.pubDate),
      description: post.frontmatter.description || '',
      link: post.url, // Astro'nun sayfa için otomatik oluşturduğu tam URL'yi çeker
    })),
    customData: `<language>tr-tr</language>`,
  });
}
