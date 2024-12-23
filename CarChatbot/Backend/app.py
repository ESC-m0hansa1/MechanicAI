from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from langchain_chroma import Chroma  # Updated import to fix deprecation warning
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM  # Updated import
from langchain_ollama.embeddings import OllamaEmbeddings

# Constants
CHROMA_PATH = "C:/Users/Asus/OneDrive/Desktop/carMech/CarChatbot/Backend/Rag/chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

app = Flask(__name__)
CORS(app)
conversation_memory = {}

# Handle favicon.ico requests
@app.route('/favicon.ico')
def favicon():
    return '', 204

def query_rag(query_text: str, k: int = 2, model_name: str = "mistral"):
    """
    Queries the RAG system and handles greetings with a default LLM response.
    """
    try:
        # Define casual greetings
        GREETINGS = ["hi", "hello", "hey", "hloo", "hola", "howdy", "greetings"]
        normalized_query = query_text.strip().lower()

        # Initialize the model
        model = OllamaLLM(model=model_name,quantization="32-bit")

        # Handle greetings directly
        if normalized_query in GREETINGS:
            greeting_prompt = "You are a helpful chatbot. Respond warmly to a casual greeting."
            response_text = model.invoke(greeting_prompt)
            return {"response": response_text, "sources": []}

        # Initialize embedding function
        embedding_function = OllamaEmbeddings(model="nomic-embed-text")

        # Load Chroma vector store
        db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

        # Perform similarity search
        results = db.similarity_search_with_score(query_text, k=k)

        if not results:
            return {"response": "No relevant information found for your query.", "sources": []}

        # Prepare context and prompt
        context_text = "\n\n---\n\n".join([doc.page_content for doc, _ in results])
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)

        # Generate response using LLM
        response_text = model.invoke(prompt)

        # Extract and deduplicate sources
        sources = list(set([doc.metadata.get("id", "Unknown") for doc, _ in results]))

        return {"response": response_text, "sources": sources}
    except Exception as e:
        # Log the error and return a generic error response
        print(f"Error in query_rag: {e}")
        return {"response": "An error occurred while processing your query.", "sources": []}

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        query = request.json.get("query")  # Ensure the frontend is sending JSON data
        if query:
            result = query_rag(query)
            return jsonify(result)  # Return the result as a JSON response
        return jsonify({"response": "Invalid query. Please provide a query."}), 400
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # Enable debug for development
