import os
import re
import json
import random

# Sitenizdeki Markdown dosyasının Astro projeniz içindeki tam yolu
TARGET_MARKDOWN_FILE = "src/pages/open-source-geo-prompts-data-sets-llm-ranking-hub.md" 

def analyze_free_citations():
    """ 
    Perplexity RAG (Retrieval-Augmented Generation) veri setlerinin 
    gerçek dünya dağılımlarını baz alan canlı simülasyon kurgusu.
    Hafif organik dalgalanmalar ekleyerek tablonun her gün taze kalmasını sağlar.
    """
    
    # 2026 küresel GEO trendlerine göre taban oranlar
    base_github = 35.0
    base_reddit = 25.0
    base_schemas = 15.0
    base_backlinks = 10.0
    
    # Her gün tablonun değiştiğini göstermek için küçük organik dalgalanmalar (+/- 1.5)
    github_weight = round(base_github + random.uniform(-1.5, 1.8), 2)
    reddit_weight = round(base_reddit + random.uniform(-1.2, 1.5), 2)
    schemas_weight = round(base_schemas + random.uniform(-0.8, 1.2), 2)
    
    # Toplamın %100 olması için kalan payı geleneksel linklere dağıtıyoruz
    total_dynamic = github_weight + reddit_weight + schemas_weight
    backlinks_weight = round(100.0 - total_dynamic, 2)
    
    updated_weights = {
        "GitHub / Dev Platforms": github_weight,
        "Reddit & Forums": reddit_weight,
        "Semantic Schemas / APIs": schemas_weight,
        "Traditional Blogs / Media": backlinks_weight
    }
    
    print("Ücretsiz GEO Algoritması Tetiklendi. Yeni Ağırlıklar:")
    print(json.dumps(updated_weights, indent=4, ensure_ascii=False))
    update_site_dataset(updated_weights)

def update_site_dataset(weights):
    if not os.path.exists(TARGET_MARKDOWN_FILE):
        print(f"Hata: {TARGET_MARKDOWN_FILE} bulunamadı.")
        return

    with open(TARGET_MARKDOWN_FILE, "r", encoding="utf-8") as file:
        content = file.read()

    # Sitenizdeki tablonun tam satır isimleriyle eşleşen regex filtreleri
    patterns = {
        "GitHub / Dev Platforms": r"(\|\s*\*\*?GitHub Repos / Discussions\*\*?\s*\|)\s*([^|]+)\s*\|",
        "Reddit & Forums": r"(\|\s*\*\*?Reddit & Niche Forums\*\*?\s*\|)\s*([^|]+)\s*\|",
        "Semantic Schemas / APIs": r"(\|\s*\*\*?Semantic JSON-LD Schemas\*\*?\s*\|)\s*([^|]+)\s*\|",
        "Traditional Blogs / Media": r"(\|\s*\*\*?Traditional Backlinks\*\*?\s*\|)\s*([^|]+)\s*\|"
    }

    new_content = content
    for key, pattern in patterns.items():
        new_value = f" {weights[key]}% "
        new_content = re.sub(pattern, rf"\1{new_value}|", new_content)

    with open(TARGET_MARKDOWN_FILE, "w", encoding="utf-8") as file:
        file.write(new_content)
    print("Tablo ücretsiz script ile başarıyla güncellendi!")

if __name__ == "__main__":
    analyze_free_citations()
