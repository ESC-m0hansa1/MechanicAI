from langchain.llms import Ollama

# Set up the Ollama model to use the LLaMA server
# llama_model = Ollama(model="mistral", host="http://localhost", port=3000)
llama_model = Ollama(model="mistral", host="http://localhost", port=11434, device="cpu")


# Query the model
response = llama_model.invoke("What is the engine service procedure for an Audi?")
print(response)
