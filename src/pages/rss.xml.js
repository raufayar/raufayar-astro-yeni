import rss from '@astrojs/rss';

export async function GET(context) {
  // src/pages/ altındaki tüm markdown dosyalarını çağır
  const postImportResult = import.meta.glob('./**/*.{md,mdx}', { eager: true });
  const rawPosts = Object.values(postImportResult);

  // Sadece gerekli alanları olan geçerli markdown yazılarını filtrele
  const validPosts = rawPosts.filter((post) => post && post.frontmatter && post.frontmatter.title);

  // Tarihe göre sırala
  const sortedPosts = validPosts.sort((a, b) => {
    const dateA = a.frontmatter.pubDate ? new Date(a.frontmatter.pubDate) : new Date(0);
    const dateB = b.frontmatter.pubDate ? new Date(b.frontmatter.pubDate) : new Date(0);
    return dateB - dateA;
  });

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://www.raufayar.net',
    items: sortedPosts.map((post) => {
      // Dosya yolundan güvenli ve hatasız URL üretme (Astro v5 uyumlu temiz yapı)
      let cleanLink = post.url;
      if (!cleanLink && post.file) {
        const parts = post.file.split('/pages/');
        if (parts[1]) {
          cleanLink = '/' + parts[1].replace(/\.(md|mdx)$/, '');
        }
      }

      return {
        title: post.frontmatter.title,
        pubDate: post.frontmatter.pubDate ? new Date(post.frontmatter.pubDate) : new Date(),
        description: post.frontmatter.description || '',
        link: cleanLink || '/',
      };
    }),
    customData: `<language>tr-tr</language>`,
  });
}
