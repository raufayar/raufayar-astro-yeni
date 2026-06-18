import rss from '@astrojs/rss';

export async function GET(context) {
  // Tüm markdown/mdx dosyalarını al (src/pages/ altındaki)
  const postImportResult = import.meta.glob('./**/*.{md,mdx}', { 
    eager: true 
  });

  const rawPosts = Object.values(postImportResult);

  // Geçerli frontmatter'ı olan postları filtrele
  const validPosts = rawPosts.filter((post) => 
    post?.frontmatter?.title && post?.frontmatter?.pubDate
  );

  // Tarihe göre azalan sırada sırala (en yeni başta)
  const sortedPosts = validPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.pubDate);
    const dateB = new Date(b.frontmatter.pubDate);
    return dateB - dateA;
  });

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://www.raufayar.net',
    items: sortedPosts.map((post) => {
      // URL temizleme - Astro'da en güvenilir yöntem
      let link = post.url;

      if (!link && post.file) {
        // post.file örneği: /home/.../src/pages/blog/yazi.md
        const relativePath = post.file.split('/pages/')[1];
        if (relativePath) {
          link = '/' + relativePath.replace(/\.(md|mdx)$/, '');
          // index dosyaları için temizleme
          link = link.replace(/\/index$/, '');
        }
      }

      return {
        title: post.frontmatter.title,
        pubDate: new Date(post.frontmatter.pubDate),
        description: post.frontmatter.description || '',
        link: link || '/',
      };
    }),
    customData: `<language>tr-TR</language>`,
  });
}
