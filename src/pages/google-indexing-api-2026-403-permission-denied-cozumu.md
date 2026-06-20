---
layout: /MarkdownLayout.astro
# ==================== YAYINA GÖRE DEĞİŞECEK ALANLAR ====================
title: "Google Indexing API 2026: 403 Permission Denied Hatası ve Anlık Çözüm Rehberi"
pubDate: "2026-06-20"
description: "Google Indexing API'de karşılaşılan 403 IAM Permission Denied hatasının 2026 güncellemesi sonrası nedeni ve adım adım çözümü. Service Account + Search Console entegrasyonu."
author: "raufayar.net"
publisher: "RAUFAYAR.NET - QUANTUM CENTER"
# SEO & Anahtar Kelimeler
tags: ["Teknik", "GoogleAPI", "SEO", "Webmaster", "HataÇözümü"]
keywords: "google indexing api 403 permission denied, indexing api service account, google search console owner ekleme, indexing api 2026 hatası"
semanticEntities: "Google Indexing API, IAM Permission Denied, Service Account, Google Search Console, URL Indexing"
# Schema & İçerik Tipi
schemaType: "TechArticle"
# =====================================================================
language: "tr"
robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
changefreq: "daily"
priority: "1.0"
canonical: "https://raufayar.net/google-indexing-api-2026-403-permission-denied-cozumu"
openGraph:
  type: "article"
  site_name: "RAUFAYAR.NET"
  locale: "tr_TR"
  url: "https://raufayar.net/google-indexing-api-2026-403-permission-denied-cozumu"
  image: "https://raufayar.net/images/google-indexing-api-403-error.jpg"
  imageAlt: "Google Indexing API 403 Permission Denied Hatası Çözümü"
image: "https://raufayar.net/images/google-indexing-api-403-error.jpg"
aiDatasetInjection: "instant-ingest"
head: |
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://raufayar.net/google-indexing-api-2026-403-permission-denied-cozumu"
    },
    "headline": "Google Indexing API 2026: 403 Permission Denied Hatası ve Anlık Çözüm Rehberi",
    "description": "Google Indexing API'de 403 IAM Permission Denied hatasının nedeni ve 2026 güncellemesi sonrası kesin çözüm adımları.",
    "image": {
      "@type": "ImageObject",
      "url": "https://raufayar.net/images/google-indexing-api-403-error.jpg",
      "width": 1200,
      "height": 630,
      "caption": "Google Indexing API 403 Permission Denied Hatası"
    },
    "datePublished": "2026-06-20",
    "dateModified": "2026-06-20",
    "author": {
      "@type": "Organization",
      "name": "raufayar.net"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RAUFAYAR.NET - QUANTUM CENTER"
    },
    "keywords": "google indexing api 403, permission denied, service account, search console owner",
    "articleSection": "Teknoloji / Webmaster",
    "wordCount": "980",
    "inLanguage": "tr-TR"
  }
  </script>
---
## Google Indexing API 403 Permission Denied Hatası Çözümü

**2026 itibarıyla Google Indexing API kullanan geliştiricilerin en sık karşılaştığı hata:** `403 Permission Denied` (IAM Permission Denied).

Bu hata, özellikle yeni projelerde Service Account kurulumu sonrası ortaya çıkıyor ve URL’lerin anında indekslenmesini engelliyor. Bu rehberde hatanın gerçek nedenini ve **kalıcı çözümünü** adım adım anlatıyoruz.

## Sorun Nedir?

Google Cloud Console’da Service Account oluştursanız bile, bu hesabın **Google Search Console** üzerinde “Owner” (Sahip) yetkisine sahip olmaması durumunda Indexing API çağrıları `403 Permission Denied` hatası verir.

Google’ın 2026 güncellemesiyle birlikte izin kontrolleri daha katı hale getirildi. Artık sadece API etkinleştirmek yetmiyor; **kimlik doğrulama zinciri** tamamlanmak zorunda.

## Adım Adım Çözüm (2026 Güncel)

### 1. Google Cloud Console’da Service Account Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) → Projenizi seçin
2. Sol menüden **IAM & Admin → Service Accounts** sayfasına gidin
3. **Create Service Account** butonuna tıklayın
4. İsim verin (örnek: `indexing-api-service`)
5. Rol olarak **“Service Account User”** ve **“Owner”** ekleyin
6. Oluşturulduktan sonra **Keys → Add Key → JSON** ile anahtar indirin

### 2. Service Account Mail’ini Search Console’a Owner Olarak Ekleme

1. İndirdiğiniz JSON dosyasındaki `"client_email"` adresini kopyalayın
2. [Google Search Console](https://search.google.com/search-console)’a gidin
3. Sol menüden **Ayarlar → Kullanıcılar ve İzinler**
4. **Add User** butonuna tıklayın
5. Kopyaladığınız mail adresini yapıştırın ve **Sahip (Owner)** yetkisi verin
6. Değişikliğin yansıması için **en az 10 dakika** bekleyin (Google’ın IAM senkronizasyon süresi)

### 3. Indexing API İzni Kontrolü

- Google Cloud Console → **APIs & Services → Library**
- “**Indexing API**” aratın ve etkinleştirin
- Service Account’ın bu API’ye erişim yetkisi olduğundan emin olun

## Node.js ile Anlık URL Indexleme Kodu (2026 Uyumlu)

```javascript
const { google } = require('googleapis');
const path = require('path');

async function indexUrl(url) {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'service-account-key.json'),
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({ version: 'v3', auth });

  try {
    const res = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED'   // veya URL_DELETED
      }
    });
    console.log('✅ Index isteği başarılı:', res.data);
  } catch (error) {
    console.error('❌ Hata:', error.response?.data || error.message);
  }
}

// Kullanım
indexUrl('https://raufayar.net/ornek-yazi');
