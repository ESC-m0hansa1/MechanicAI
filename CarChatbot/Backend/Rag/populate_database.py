import argparse
import os
import shutil
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_chroma import Chroma  # Updated import for Chroma
from langchain_ollama import OllamaEmbeddings  # Updated import for OllamaEmbeddings


DATA_PATH = "C:/Users/Asus/OneDrive/Desktop/carMech/CarChatbot/Backend/Data"
CHROMA_PATH = "C:/Users/Asus/OneDrive/Desktop/carMech/CarChatbot/Backend/Rag/chroma"

def load_documents():
    print("📂 Loading documents...")
    document_loader = PyPDFDirectoryLoader(DATA_PATH)
    documents = document_loader.load()
    print(f"✅ Loaded {len(documents)} documents.")
    return documents

def split_documents(documents: list[Document]):
    print("✂ Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"✅ Split into {len(chunks)} chunks.")
    return chunks

def get_embedding_function():
    print("🧠 Initializing embedding function...")
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    return embeddings

def calculate_chunk_ids(chunks):
    print("🔢 Calculating chunk IDs...")
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        # If the page ID is the same as the last one, increment the index.
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        # Calculate the chunk ID.
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        # Add it to the page metadata.
        chunk.metadata["id"] = chunk_id

    print("✅ Chunk IDs calculated.")
    return chunks

def add_to_chroma(chunks: list[Document]):
    print("📦 Adding chunks to Chroma database...")
    db = Chroma(
        persist_directory=CHROMA_PATH, embedding_function=get_embedding_function()
    )
    chunks_with_ids = calculate_chunk_ids(chunks)

    existing_items = db.get(include=[])
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"👉 Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)  # Add the new documents
    else:
        print("✅ No new documents to add.")

def clear_database():
    if os.path.exists(CHROMA_PATH):
        print("🗑 Clearing Chroma database...")
        shutil.rmtree(CHROMA_PATH)
        print("✅ Database cleared.")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset the database.")
    args = parser.parse_args()

    if args.reset:
        clear_database()

    # Load documents and update the database.
    documents = load_documents()
    chunks = split_documents(documents)
    add_to_chroma(chunks)

if __name__ == "__main__":
    main()