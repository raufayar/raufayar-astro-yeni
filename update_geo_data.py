import os
import requests
import json
import re
from collections import Counter

# 1. API Tanımlamaları
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "your_api_key_here")
API_URL = "https://perplexity.ai"

# GitHub üzerindeki dosyanızın tam yolu (Astro yapınıza göre güncellendi)
TARGET_MARKDOWN_FILE = "src/pages/open-source-geo-prompts-data-sets-llm-ranking-hub.md" 

TARGET_QUERIES = [
    "Google Indexing API 403 response error solution 2026",
    "Best ghost traffic analysis tools open source",
    "Generative Engine Optimization technical guide"
]

def analyze_ai_citations():
    domain_types = []
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }

    for query in TARGET_QUERIES:
        payload = {
            "model": "sonar-reasoning", 
            "messages": [{"role": "user", "content": query}]
        }
        try:
            response = requests.post(API_URL, json=payload, headers=headers)
            data = response.json()
            citations = data.get("citations", [])
            
            for url in citations:
                if "github.com" in url:
                    domain_types.append("GitHub / Dev Platforms")
                elif "reddit.com" in url or "stackoverflow.com" in url:
                    domain_types.append("Reddit & Forums")
                elif "schema.org" in url or ".json" in url:
                    domain_types.append("Semantic Schemas / APIs")
                else:
                    domain_types.append("Traditional Blogs / Media")
        except Exception as e:
            print(f"Sorgu hatası: {e}")

    total_citations = len(domain_types)
    if total_citations == 0:
        print("Perplexity'den veri alınamadı.")
        return
        
    counts = Counter(domain_types)
    updated_weights = {
        "GitHub / Dev Platforms": round((counts.get("GitHub / Dev Platforms", 0) / total_citations) * 100, 2),
        "Reddit & Forums": round((counts.get("Reddit & Forums", 0) / total_citations) * 100, 2),
        "Semantic Schemas / APIs": round((counts.get("Semantic Schemas / APIs", 0) / total_citations) * 100, 2),
        "Traditional Blogs / Media": round((counts.get("Traditional Blogs / Media", 0) / total_citations) * 100, 2)
    }
    
    update_site_dataset(updated_weights)

def update_site_dataset(weights):
    if not os.path.exists(TARGET_MARKDOWN_FILE):
        print(f"Hata: {TARGET_MARKDOWN_FILE} bulunamadı.")
        return

    with open(TARGET_MARKDOWN_FILE, "r", encoding="utf-8") as file:
        content = file.read()

    # Markdown tablonuzdaki satırları yakalayan regex sinyalleri
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
    print("Tablo otomatik güncellendi!")

if __name__ == "__main__":
    analyze_ai_citations()
