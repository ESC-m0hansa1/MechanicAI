import argparse
import os
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM  # Updated import
from langchain_ollama.embeddings import OllamaEmbeddings

# Use a default relative path for CHROMA_PATH, but allow configuration via environment variable or CLI
DEFAULT_CHROMA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "chroma")

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

def main():
    parser = argparse.ArgumentParser(description="Query the RAG system with a given text.")
    parser.add_argument("query_text", type=str, help="The query text to process.")
    parser.add_argument("--chroma_path", type=str, default=os.getenv("CHROMA_PATH", DEFAULT_CHROMA_PATH),
                        help="Directory for Chroma database. Default is set to an environment variable or relative path.")
    parser.add_argument("--k", type=int, default=5, help="Number of top results to return. Default is 5.")
    parser.add_argument("--model", type=str, default="mistral", help="Ollama model to use. Default is 'mistral'.")
    args = parser.parse_args()

    chroma_path = args.chroma_path

    # Ensure CHROMA_PATH is valid
    if not os.path.exists(chroma_path):
        os.makedirs(chroma_path)

    query_text = args.query_text
    k = args.k
    model_name = args.model

    query_rag(query_text, k, model_name, chroma_path)

def query_rag(query_text: str, k: int, model_name: str, chroma_path: str):
    def get_embedding_function():
        print("\U0001F9E0 Initializing embedding function...")
        return OllamaEmbeddings(model="nomic-embed-text")

    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=chroma_path, embedding_function=embedding_function)

    print(f"\U0001F50D Searching for top {k} results...")
    results = db.similarity_search_with_score(query_text, k=k)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _ in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)

    print(f"\U0001F5E3 Using model '{model_name}' to generate response...")
    model = OllamaLLM(model=model_name)  # Updated usage without host, port, or device
    response_text = model.invoke(prompt)

    sources = [doc.metadata.get("id", "Unknown") for doc, _ in results]
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    print(formatted_response)
    return response_text

if __name__ == "__main__":
    main()
