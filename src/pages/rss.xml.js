import rss from '@astrojs/rss';

export async function GET(context) {
  const postImportResult = import.meta.glob('./**/*.{md,mdx}', { eager: true });
  const rawPosts = Object.values(postImportResult);

  // Geçerli postları filtrele
  const validPosts = rawPosts.filter((post) => 
    post?.frontmatter?.title && 
    post?.frontmatter?.pubDate
  );

  // Tarihe göre sırala (en yeni en üstte)
  const sortedPosts = validPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.pubDate);
    const dateB = new Date(b.frontmatter.pubDate);
    return dateB.getTime() - dateA.getTime();   // ← Burası düzeltildi
  });

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://www.raufayar.net',
    items: sortedPosts.map((post) => {
      // Daha güvenli URL üretimi
      let link = post.url;

      if (!link && post.file) {
        const parts = post.file.split('/pages/');
        if (parts[1]) {
          link = '/' + parts[1]
            .replace(/\.(md|mdx)$/, '')     // uzantıyı kaldır
            .replace(/\/index$/, '');       // /index → /
        }
      }

      return {
        title: post.frontmatter.title,
        pubDate: new Date(post.frontmatter.pubDate),
        description: post.frontmatter.description || post.frontmatter.excerpt || '',
        link: link || '/',
      };
    }),
    customData: `<language>tr-TR</language>`,
  });
}
