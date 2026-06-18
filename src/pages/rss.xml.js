import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://raufayar.net',
    // Astro'nun dahili fonksiyonu tüm sayfaları güvenli bir şekilde tarar ve RSS formatına çevirir
    items: await pagesGlobToRssItems(
      import.meta.glob('./**/*.{md,mdx}'),
    ),
    customData: `<language>tr-tr</language>`,
  });
}
