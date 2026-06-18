import rss from '@astrojs/rss';

export async function GET(context) {
  // src/pages/ altındaki tüm markdown dosyalarını güvenli bir şekilde tara
  const postImportResult = import.meta.glob('./**/*.{md,mdx}', { eager: true });
  
  // Sadece nesne formatında olan modülleri listeye al
  const rawPosts = Object.values(postImportResult);

  // KRİTİK FİLTRE: Sadece frontmatter alanı olan ve geçerli bir başlığı bulunan dosyaları seç
  // Bu sayede şemaya uymayan eksik sayfalar derlemeyi (build) ÇÖKERTEMEZ.
  const validPosts = rawPosts.filter((post) => post && post.frontmatter && post.frontmatter.title);

  // Yazıları tarihe göre sırala (tarih yoksa en sona at)
  const sortedPosts = validPosts.sort((a, b) => {
    const dateA = a.frontmatter.pubDate ? new Date(a.frontmatter.pubDate) : new Date(0);
    const dateB = b.frontmatter.pubDate ? new Date(b.frontmatter.pubDate) : new Date(0);
    return dateB - dateA;
  });

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://raufayar.net',
    items: sortedPosts.map((post) => ({
      title: post.frontmatter.title,
      // Eğer pubDate girilmemişse derleme hata vermesin diye bugünün tarihini ata
      pubDate: post.frontmatter.pubDate ? new Date(post.frontmatter.pubDate) : new Date(),
      description: post.frontmatter.description || '',
      // Astro v5 için en güvenli link üretim mimarisi:
      link: post.url || `/${post.file?.split('/pages/')?.[1]?.replace(/\.(md|mdx)$/, '')}/`,
    })),
    customData: `<language>tr-tr</language>`,
  });
}
