from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Veriyi yükle
with open('altinbas_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Metinleri birleştir
documents = []
for page in data:
    for ann in page.get('announcements', []):
        documents.append(f"{ann['title']}: {ann['content']}")

# Embedding modeli yükle
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
embeddings = model.encode(documents)

# FAISS indeksi oluştur
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)