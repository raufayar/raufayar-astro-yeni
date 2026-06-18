import rss from '@astrojs/rss';

export async function GET(context) {
  // Astro v5 için güncel güvenli dosya tarama yöntemi
  const postImportResult = import.meta.glob('./**/*.{md,mdx}', { eager: true });
  
  // Sadece geçerli modülleri filtrele ve listeye çevir
  const posts = Object.values(postImportResult).filter(post => post && typeof post === 'object');

  // pubDate parametresi olanları filtrele ve tarihe göre en yeniye doğru sırala
  const sortedPosts = posts
    .filter(post => post.frontmatter?.pubDate)
    .sort((a, b) => new Date(b.frontmatter.pubDate) - new Date(a.frontmatter.pubDate));

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://www.raufayar.net',
    items: sortedPosts.map((post) => ({
      title: post.frontmatter.title || 'Başlıksız İçerik',
      pubDate: new Date(post.frontmatter.pubDate),
      description: post.frontmatter.description || '',
      // Astro v5'te url parametresi yoksa dosya adından link üretmek için alternatif güvenli yapı:
      link: post.url || `/${post.file?.split('/pages/')[1]?.replace(/\.(md|mdx)$/, '')}/`, 
    })),
    customData: `<language>tr-tr</language>`,
  });
}
