import rss from '@astrojs/rss';

export async function GET(context) {
  // src/pages/ altındaki tüm markdown dosyalarını çağırır
  const postImportResult = import.meta.glob('./**/*.{md,mdx}', { eager: true });
  const rawPosts = Object.values(postImportResult);

  const validPosts = rawPosts.filter((post) => 
    post && 
    post.frontmatter && 
    post.frontmatter.title && 
    post.frontmatter.canonical
  );

  const sortedPosts = validPosts.sort((a, b) => {
    const dateA = a.frontmatter.pubDate ? new Date(a.frontmatter.pubDate) : new Date(0);
    const dateB = b.frontmatter.pubDate ? new Date(b.frontmatter.pubDate) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://www.raufayar.net',
    items: sortedPosts.map((post) => {
      const cleanLink = post.frontmatter.canonical
        .replace('https://raufayar.net', '')
        .replace('https://www.raufayar.net', '');

      return {
        title: post.frontmatter.title,
        pubDate: post.frontmatter.pubDate ? new Date(post.frontmatter.pubDate) : new Date(),
        description: post.frontmatter.description || '',
        link: cleanLink.endsWith('/') ? cleanLink : `${cleanLink}/`,
      };
    }),
    // GÜNCEL VE TEK BİRLEŞTİRİLMİŞ CUSTOM DATA:
    customData: `<language>tr-TR</language><atom:link href="https://www.raufayar.net/rss.xml" rel="self" type="application/rss+xml"/><link rel="hub" href="https://pubsubhubbub.appspot.com/"/>`,
  });
}
