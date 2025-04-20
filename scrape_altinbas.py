import requests
from bs4 import BeautifulSoup
import json

def scrape_altinbas(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Örnek: Duyuruları çekme (site yapısına göre güncelleyin)
    announcements = []
    for item in soup.select('.duyuru-listesi .duyuru-item'):
        title = item.select_one('.duyuru-baslik').text.strip()
        content = item.select_one('.duyuru-icerik').text.strip()
        announcements.append({'title': title, 'content': content})
    
    return {'url': url, 'announcements': announcements}

# Ana sayfa ve alt sayfalar
urls = [
    'https://altinbas.edu.tr',
    'https://altinbas.edu.tr/duyurular',
    'https://altinbas.edu.tr/haberler',
    'https://altinbas.edu.tr/yonetmelikler'
]

all_data = []
for url in urls:
    all_data.append(scrape_altinbas(url))

with open('altinbas_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)