from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    query = request.json['query']
    query_embedding = model.encode([query])
    k = 3  # Dönecek sonuç sayısı
    distances, indices = index.search(query_embedding, k)
    
    results = []
    for idx in indices[0]:
        results.append(documents[idx])
    
    return jsonify({'response': results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)