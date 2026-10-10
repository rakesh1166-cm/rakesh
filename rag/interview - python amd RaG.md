 What are 20 commonly used Python functions and methods in AI engineering? Explain each in a table with its purpose, output format, and a simple code example.
| # | Function / method | Simple purpose | Example |
|---|---|---|---|
| 1 | `len()` | Count items or characters | `len(chunks)` |
| 2 | `enumerate()` | Get each item with its number | `enumerate(pages, start=1)` |
| 3 | `zip()` | Pair related items | `zip(chunks, vectors)` |
| 4 | `str.strip()` | Remove surrounding whitespace | `text.strip()` |
| 5 | `str.replace()` | Replace text | `text.replace("\n", " ")` |
| 6 | `str.split()` | Split text into a list | `text.split()` |
| 7 | `str.join()` | Combine strings | `"\n".join(chunks)` |
| 8 | `dict.get()` | Read a value with a fallback | `metadata.get("page", 1)` |
| 9 | `list.append()` | Add one item to a list | `chunks.append(text)` |
| 10 | `list.extend()` | Add multiple items to a list | `chunks.extend(new_chunks)` |
| 11 | `sorted()` | Sort results | `sorted(results, key=lambda x: x["score"], reverse=True)` |
| 12 | `open()` | Open a file | `open("sample.pdf", "rb")` |
| 13 | `io.BytesIO()` | Treat bytes like an in-memory file | `io.BytesIO(pdf_bytes)` |
| 14 | `json.loads()` | Convert JSON text into Python data | `json.loads('{"question": "What is RAG?"}')` |
| 15 | `json.dumps()` | Convert Python data into JSON text | `json.dumps({"answer": "Hello"})` |
| 16 | `os.getenv()` | Read an environment variable | `os.getenv("OPENAI_API_KEY")` |
| 17 | `re.sub()` | Clean text using a pattern | `re.sub(r"\s+", " ", text)` |
| 18 | `np.array()` | Convert numbers into a NumPy array | `np.array([0.1, 0.2, 0.3])` |
| 19 | `np.dot()` | Calculate a dot product, useful for vector comparisons | `np.dot(vector_a, vector_b)` |
| 20 | `np.linalg.norm()` | Calculate a vector’s length | `np.linalg.norm(vector_a)` |

1. len() — Count items
chunks = ["AI basics", "RAG basics", "Python basics"]
print(len(chunks))


Output:
3

2. enumerate() — Get a number and item
pages = ["AI basics", "RAG basics"]for page_no, text in enumerate(pages, start=1):  
  print(page_no, text)


Output:
1 AI basics
2 RAG basics

3. zip() — Pair related items
chunks = ["AI basics", "RAG basics"]vectors = [[0.1, 0.2], [0.3, 0.4]]for text, vector in zip(chunks, vectors): 
   print(text, vector)


Output:
AI basics [0.1, 0.2]
RAG basics [0.3, 0.4]

4. .strip() — Remove surrounding whitespace
text = "  AI is useful.\n"print(text.strip())


Output:
AI is useful.

5. .replace() — Replace text
text = "AI\nis useful."print(text.replace("\n", " "))


Output:
AI is useful.

6. .split() — Split text into words
text = "AI is useful"print(text.split())


Output:
['AI', 'is', 'useful']

7. .join() — Combine strings
chunks = ["AI is useful.", "RAG retrieves information."]
print("\n".join(chunks))


Output:
AI is useful.
RAG retrieves information.

8. .get() — Read a dictionary value with a fallback
metadata = {"page": 2}print(metadata.get("page", 1))
print(metadata.get("source", "Unknown"))


Output:
2
Unknown

The fallback is used when the key is missing.
9. .append() — Add one item
chunks = ["AI basics"]chunks.append("RAG basics")
print(chunks)


Output:
['AI basics', 'RAG basics']

10. .extend() — Add multiple items
chunks = ["AI basics"]chunks.extend(["RAG basics", "Python basics"])
print(chunks)


Output:
['AI basics', 'RAG basics', 'Python basics']

11. sorted() — Sort results by score
results = [    {"text": "Document A", "score": 0.7},    {"text": "Document B", "score": 0.9},]ranked = sorted(    results,    key=lambda item: item["score"],    reverse=True)for item in ranked:   
 print(item["text"], item["score"])


Output:
Document B 0.9
Document A 0.7

12. open() — Write and read a file
with open("sample.txt", "w", encoding="utf-8") as file: 
   file.write("AI helps people.")
   with open("sample.txt", "r", encoding="utf-8") as file:  
     print(file.read())


Output:
AI helps people.

13. io.BytesIO() — Read bytes like a file
import iodata = b"AI document"file = io.BytesIO(data)
print(file.read())


Output:
b'AI document'

The b indicates bytes, rather than a text string.
14. json.loads() — Convert JSON text into Python data
import jsontext = '{"question": "What is RAG?"}'data = json.loads(text)print(data)
print(data["question"])


Output:
{'question': 'What is RAG?'}
What is RAG?

15. json.dumps() — Convert Python data into JSON text
import jsondata = {"answer": "RAG retrieves relevant information."}text = json.dumps(data)
print(text)


Output:
{"answer": "RAG retrieves relevant information."}

16. os.getenv() — Read an environment variable
import os# Set a sample variable for this exampleos.environ["EMBEDDING_MODEL"] = "text-embedding-3-large"
print(os.getenv("EMBEDDING_MODEL"))


Output:
text-embedding-3-large

17. re.sub() — Replace text matching a pattern
import retext = "AI    helps\npeople."clean_text = re.sub(r"\s+", " ", text)
print(clean_text)


Output:
AI helps people.

Here, \s+ matches one or more whitespace characters.
18. np.array() — Create a numeric array
import numpy as npvector = np.array([0.1, 0.2, 0.3])
print(vector)


Output:
[0.1 0.2 0.3]

19. np.dot() — Calculate a dot product
import numpy as npvector_a = np.array([1, 2, 3])vector_b = np.array([4, 5, 6])
print(np.dot(vector_a, vector_b))


Output:
32

Calculation: 1×4 + 2×5 + 3×6 = 32.
20. np.linalg.norm() — Calculate a vector’s length
import numpy as npvector = np.array([3, 4])
print(np.linalg.norm(vector))


Output:
5.0

2. What are 15 commonly used Python type declarations in AI engineering? Show each declaration, its meaning, and example data in a table.
| # | Declaration | Meaning | Example data |
| -- | -- | -- | -- |
| 1 | `text: str = ""` | One text string | `"AI is useful."` |
| 2 | `page_no: int = 0` | One whole number | `1` |
| 3 | `score: float = 0.0` | One decimal number | `0.95` |
| 4 | `is_indexed: bool = False` | True or false | `True` |
| 5 | `chunks: list[str] = []` | List of text chunks | `["AI basics", "RAG basics"]` |
| 6 | `page_numbers: list[int] = []` | List of whole numbers | `[1, 2, 3]` |
| 7 | `embedding: list[float] = []` | One embedding vector | `[0.1, 0.2, 0.3]` |
| 8 | `pair: tuple[int, str] = (0, "")` | One page-and-text pair | `(1, "AI is useful.")` |
| 9 | `pieces: list[tuple[int, str]] = []` | List of page-and-text pairs | `[(1, "AI basics"), (2, "RAG basics")]` |
| 10 | `matches: list[tuple[str, float]] = []` | List of text-and-score pairs | `[("AI basics", 0.95), ("RAG basics", 0.85)]` |
| 11 | `vectors: list[list[float]] = []` | List of embedding vectors | `[[0.1, 0.2], [0.3, 0.4]]` |
| 12 | `metadata: dict[str, str] = {}` | Dictionary with text keys and values | `{"source": "sample.pdf", "title": "AI Guide"}` |
| 13 | `pages: dict[int, str] = {}` | Page number mapped to text | `{1: "AI basics", 2: "RAG basics"}` |
| 14 | `groups: dict[str, list[str]] = {}` | Source mapped to a list of chunks | `{"sample.pdf": ["AI basics", "RAG basics"]}` |
| 15 | `sources: list[dict[str, str]] = []` | List of source dictionaries | `[{"title": "AI Guide", "url": "https://example.com"}]` |
3. What are 20 commonly used Python method calls in AI engineering and RAG? Present them in a table with each method call, its purpose in simple words, and an example output.

| # | Method call | Simple purpose |
|---|---|---|
| 1 | `PyPDFLoader("file.pdf").load()` | Read a PDF into documents. |
| 2 | `text_splitter.split_documents(docs)` | Split documents into smaller chunks. |
| 3 | `client.embeddings.create(model=..., input=texts)` | Create vectors directly through OpenAI. |
| 4 | `embedding_model.embed_documents(texts)` | Create vectors for multiple texts through LangChain. |
| 5 | `embedding_model.embed_query(question)` | Create one vector for a question. |
| 6 | `QdrantVectorStore.from_documents(...)` | Create vectors and store documents in Qdrant. |
| 7 | `QdrantVectorStore.from_existing_collection(...)` | Connect to an existing Qdrant collection. |
| 8 | `vector_store.add_documents(new_chunks)` | Embed and store additional documents. |
| 9 | `vector_store.similarity_search(question, k=3)` | Find the three most relevant chunks. |
| 10 | `client.responses.create(model=..., input=...)` | Generate an answer using an LLM. |
| 11 | `text_splitter.split_text(text)` | Split a plain string into smaller strings. |
| 12 | `vector_store.similarity_search_with_score(question, k=3)` | Retrieve relevant chunks with similarity scores. |
| 13 | `vector_store.similarity_search_by_vector(vector, k=3)` | Search using an already created vector. |
| 14 | `vector_store.max_marginal_relevance_search(question, k=3)` | Retrieve relevant chunks while reducing repetition. |
| 15 | `vector_store.as_retriever(search_kwargs={"k": 3})` | Create a retriever for use in a RAG pipeline. |
| 16 | `retriever.invoke(question)` | Run the retriever and return relevant documents. |
| 17 | `vector_store.delete(ids=chunk_ids)` | Delete stored chunks by their IDs. |
| 18 | `llm.invoke(prompt)` | Generate a response through a LangChain chat model. |
| 19 | `llm.stream(prompt)` | Receive the response gradually as it is generated. |
| 20 | `llm.batch([prompt1, prompt2])` | Generate responses for multiple prompts. |


1. PyPDFLoader(...).load() — Read a PDF
PyPDFLoader(...).load() — Read a PDF
loader = PyPDFLoader("file.pdf")pdf_docs = loader.load()
print(pdf_docs[0].page_content)


Sample output, assuming the PDF contains this text:
AI means artificial intelligence.

2. split_documents() — Split documents into chunks
chunks = text_splitter.split_documents(docs)for chunk in chunks:   
 print(chunk.page_content)


Output:
AI means artificial intelligence.
RAG retrieves information.

Each chunk is a Document containing text and metadata.
3. client.embeddings.create() — Create vectors through OpenAI
response = client.embeddings.create(    model="text-embedding-3-large",    input=["AI is useful."])
print(response.data[0].embedding[:5])


Sample output:
[0.012, -0.034, 0.056, -0.018, 0.029]

[:5] displays only the first five numbers.
4. embed_documents() — Create vectors for multiple texts
vectors = embedding_model.embed_documents(texts)print("Number of vectors:", len(vectors))
print("First vector:", vectors[0][:5])print("Second vector:", vectors[1][:5])


Sample output:
Number of vectors: 2
First vector: [0.012, -0.034, 0.056, -0.018, 0.029]
Second vector: [0.078, 0.021, -0.045, 0.032, -0.011]

5. embed_query() — Create one vector for a question
question_vector = embedding_model.embed_query(    "What is AI?")
print(question_vector[:5])


Sample output:
[0.045, -0.018, 0.029, 0.061, -0.023]

6. from_documents() — Create vectors and store documents
vector_store = QdrantVectorStore.from_documents(    documents=chunks,    embedding=embedding_model,    collection_name="sample_collection",    url="http://localhost:6333")
print(type(vector_store).__name__)


Output:
QdrantVectorStore

The chunks, metadata, and vectors are now stored in Qdrant.
7. from_existing_collection() — Connect to stored data
existing_store = QdrantVectorStore.from_existing_collection(    embedding=embedding_model,    collection_name="sample_collection",    url="http://localhost:6333")
print(type(existing_store).__name__)


Output:
QdrantVectorStore

This connects to the collection without adding documents.
8. add_documents() — Add more documents
new_chunks = [    Document(        page_content="AI helps computers perform tasks.",        metadata={"source": "extra_notes"}    )]added_ids = vector_store.add_documents(new_chunks)
print(added_ids)


Sample output:
['550e8400-e29b-41d4-a716-446655440000']

Save these IDs if you need to delete the documents later.
9. similarity_search() — Find relevant chunks
results = vector_store.similarity_search(    "What is AI?",    k=2)for doc in results:  
  print(doc.page_content)


Sample output:
AI means artificial intelligence.
AI helps computers perform tasks.

10. client.responses.create() — Generate an answer
response = client.responses.create(    model=MODEL_NAME,    input="Explain AI in one short sentence.")
print(response.output_text)


Sample output:
AI helps computers perform tasks that usually require human intelligence.

11. split_text() — Split a plain string
text = "AI is useful.\nRAG retrieves information."text_chunks = text_splitter.split_text(text)
print(text_chunks)


Output:
['AI is useful.', 'RAG retrieves information.']

Unlike split_documents(), this returns strings.
12. similarity_search_with_score() — Get chunks and scores
results = vector_store.similarity_search_with_score(    "What is AI?",    k=1)for doc, score in results: 
   print("Text:", doc.page_content)    print("Score:", round(score, 2))


Sample output:
Text: AI means artificial intelligence.
Score: 0.91

The score’s meaning depends on the collection’s distance metric.
13. similarity_search_by_vector() — Search using a vector
question_vector = embedding_model.embed_query(    "What is AI?")results = vector_store.similarity_search_by_vector(    question_vector,    k=1)
print(results[0].page_content)


Sample output:
AI means artificial intelligence.

14. max_marginal_relevance_search() — Find varied results
results = vector_store.max_marginal_relevance_search(    "Explain AI and information retrieval.",    k=2,    fetch_k=3)for doc in results:    print(doc.page_content)


Sample output:
AI means artificial intelligence.
RAG retrieves information.

This balances relevance with variety.
15. as_retriever() — Create a retriever
retriever = vector_store.as_retriever(    search_kwargs={"k": 2})
print(type(retriever).__name__)


Output:
VectorStoreRetriever

This creates the retriever; it does not run a search yet.
16. retriever.invoke() — Run the retriever
retrieved_docs = retriever.invoke(    "What is AI?")for doc in retrieved_docs:   
 print(doc.page_content)


Sample output:
AI means artificial intelligence.
AI helps computers perform tasks.

17. delete() — Delete stored documents
# Deletes the document added in example 8success = vector_store.delete(ids=added_ids)
print(success)


Output on successful deletion:
True

18. llm.invoke() — Generate one response through LangChain
response = llm.invoke(    "What is AI? Answer in one sentence.")
print(response.content)


Sample output:
AI means artificial intelligence, which enables computers to perform intelligent tasks.

19. llm.stream() — Display an answer as it arrives
for chunk in llm.stream(    "Explain AI in one sentence."):  
  print(chunk.content, end="", flush=True)print()


Sample final output, appearing gradually:
AI enables computers to perform tasks that usually require human intelligence.

Each chunk can contain part of a word, one word, or several words.
20. llm.batch() — Generate answers for multiple prompts
responses = llm.batch([    "What is AI? Answer briefly.",    "What is RAG? Answer briefly."])for index, response in enumerate(responses, start=1):   
 print(f"{index}. {response.content}")


Sample output:
1. AI means artificial intelligence.
2. RAG combines retrieved information with an LLM to generate answers.

21. extend() — Add multiple items to an existing list
It is a Python list method, often used to collect chunks from multiple documents.
all_chunks = ["AI is useful."]new_chunks = [    "RAG retrieves information.",    "Embeddings convert text into vectors."]all_chunks.extend(new_chunks)print(all_chunks)


Output:
[
    'AI is useful.',
    'RAG retrieves information.',
    'Embeddings convert text into vectors.'
]
