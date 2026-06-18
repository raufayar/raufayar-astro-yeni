import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // NOT: Eğer blog içeriği için kullandığınız klasör adı 'blog' değilse burayı değiştirin
  const posts = await getCollection('blog'); 

  // Yazıları en yeni tarihe göre sıralar
  const sortedPosts = posts.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));

  return rss({
    title: 'Rauf Ayar',
    description: 'Sistem Gerçeklik Algoritması ve Güncel İçerikler',
    site: context.site || 'https://raufayar.net',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description || '',
      // Astro v5'te slug yerine 'id' kullanılır (dosya adını temel alır)
      link: `/blog/${post.id}/`, 
    })),
    customData: `<language>tr-tr</language>`,
  });
}
