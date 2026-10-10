# RAG Interview Questions

## 1. RAG Basics

1. What is a RAG (Retrieval-Augmented Generation) pipeline?
2. How do you design a RAG pipeline?
3. What basic problem does RAG solve?
4. If you give a 400-page PDF directly to an LLM, why is it costly? How does RAG help avoid wasting tokens?
5. How does RAG help avoid hitting the LLM context window limit?
6. How does RAG help reduce hallucination?
7. How does a RAG pipeline work when the data source is a PDF?
8. What are the two phases of a RAG pipeline?
9. What is the indexing phase, and what does it produce for the query phase?
10. What is the query phase?

Reference: https://medium.com/@drjulija/what-is-retrieval-augmented-generation-rag-938e4f6e03d1

## 2. Indexing Phase

Flow: `Data source → Chunking / Splitting → Generate embeddings → Store embeddings + chunks in vector store`

Code: [app/index.py](app/index.py)

1. What are the steps of the indexing phase?
2. **Reading:** How do you read a PDF file and load it into memory using LangChain Community?
3. **Chunking:** How do you split a document into chunks using a text splitter?
4. **Embedding:** How do you create embeddings for the chunks using OpenAI Embeddings?
5. **Storing:** How do you create a Qdrant vector store and save the embeddings and chunks in it?

## 3. Query Phase

Flow: `User query → Embedding model → Similarity search → Top-k chunks → LLM → Response`

Code: [app/routes/query.py](app/routes/query.py)

1. What are the steps of the query phase?
2. How do you create an embedding for the user's query using OpenAI Embeddings?
3. Why is similarity search used in the query phase?
4. What are top-k chunks, and how are they passed to the LLM?

## 4. Embedding Model

1. Why do the indexing phase and the query phase both use an embedding model?
2. Why do we need the embedding model in the indexing phase?
3. Why do we need the embedding model in the query phase?
4. How does the computer turn words into numbers (vectors)?
5. How does the computer compare these numbers to find the right answer?

## 5. Qdrant Vector Store

1. How do you write (save) data into the Qdrant vector store?
2. How do you read (search) data from the Qdrant vector store?
3. Why do we use `from_documents` only once, during indexing?
4. Why do we use `from_existing_collection` in the query phase?
5. How do you view Qdrant data (for example, in the Qdrant dashboard)?

## 6. Chunking Strategies

1. What is the difference between `chunk_size` and `chunk_overlap`? Why is overlap needed?
2. What happens if chunks are too big? What happens if they are too small?
3. What is the difference between `CharacterTextSplitter` and `RecursiveCharacterTextSplitter`?
4. What is semantic chunking, and when would you use it?
5. How would you chunk tables, code, or structured data differently from plain text?
6. Why is metadata (page number, source file) stored with each chunk?

## 7. Embeddings and Similarity

1. What is cosine similarity? How is it different from dot product and Euclidean distance?
2. What is the dimension of an embedding, and how does it affect cost and accuracy?
3. What happens if you use one embedding model for indexing and a different one for querying?
4. How do you choose an embedding model (OpenAI, open-source, multilingual)?
5. What is the difference between dense and sparse (keyword/BM25) retrieval?

## 8. Vector Databases

1. What is a vector database, and how is it different from a SQL database?
2. What is a collection in Qdrant?
3. What is Approximate Nearest Neighbor (ANN) search? What is HNSW?
4. Compare Qdrant, Pinecone, Chroma, FAISS, Weaviate, and pgvector.
5. How do you filter search results by metadata in Qdrant?
6. How do you update or delete documents that are already indexed?
7. How do you avoid duplicate chunks when the same PDF is indexed twice?

## 9. Retrieval Quality

1. How do you choose the value of `k` in top-k retrieval?
2. What is hybrid search (dense + keyword), and why is it useful?
3. What is re-ranking, and how does a cross-encoder improve results?
4. What is query rewriting / query expansion? What is HyDE?
5. What is Maximal Marginal Relevance (MMR)?
6. What is the "lost in the middle" problem?
7. What do you do when retrieval returns irrelevant chunks?

## 10. Prompting and Generation

1. How do you build the prompt that combines the user question with the retrieved chunks?
2. How do you make the LLM answer only from the given context and say "I don't know" otherwise?
3. How do you add citations or source references (page numbers) to the answer?
4. How do you handle follow-up questions and chat history in RAG (conversational RAG)?

## 11. Evaluation

1. How do you evaluate a RAG pipeline?
2. What are context precision, context recall, faithfulness, and answer relevancy?
3. What is RAGAS?
4. How do you tell whether a wrong answer was caused by retrieval or by generation?
5. How do you build a test dataset of questions and expected answers?

## 12. Production and Scaling

1. How do you index thousands of PDFs efficiently (batching, background jobs)?
2. How do you reduce latency and cost in the query phase (caching, smaller models)?
3. How do you keep the index up to date when source documents change?
4. How do you handle multiple users or tenants with access control on documents?
5. How do you secure API keys and the vector DB in a FastAPI app?
6. What is prompt injection in RAG, and how do you protect against it?
7. How do you handle scanned PDFs (OCR) and images?

## 13. RAG vs Other Approaches

1. RAG vs fine-tuning: when would you use each?
2. RAG vs long-context LLMs: is RAG still needed with 1M-token context windows?
3. What is Agentic RAG?
4. What is GraphRAG?
5. What is multi-modal RAG?
6. What are the main limitations of RAG?

## 14. FastAPI Project-Specific

1. How is the RAG pipeline exposed as an API endpoint in FastAPI?
2. Why is indexing run as a separate script instead of on every request?
3. How do you stream the LLM response back to the client in FastAPI?
4. How do you connect to Qdrant running in Docker from the FastAPI app?
===================================================================
1. What is a RAG pipeline?
RAG finds relevant information from your documents and gives it to an LLM to answer a question.

2. How do you design a RAG pipeline?
Load documents → split into chunks → create embeddings → store them → retrieve relevant chunks → generate an answer.

3. What basic problem does RAG solve?
It helps an LLM answer using information it may not know, such as your private documents.
4. What are 10 uses of RAG, and which LLM problems do they solve?
| # | RAG feature | LLM struggle | How RAG helps |
|---|---|---|---|
| 1 | **PDF analyzer** | A long PDF is too large to process at once. | Finds relevant sections to answer questions. |
| 2 | **Company policy assistant** | Doesn’t know your company’s private policies. | Retrieves answers from policy documents. |
| 3 | **Product support chatbot** | May guess product instructions. | Uses actual manuals and support guides. |
| 4 | **Latest information assistant** | Training knowledge can be outdated. | Retrieves information from updated sources. |
| 5 | **Codebase assistant** | Doesn’t know your project’s code. | Finds relevant code to explain its behavior. |
| 6 | **Research paper assistant** | May invent references. | Retrieves real papers and supporting passages. |
| 7 | **Document comparison tool** | Struggles with many large documents. | Retrieves relevant sections for comparison. |
| 8 | **Customer history assistant** | Doesn’t know a customer’s past issues. | Retrieves their relevant support records. |
| 9 | **Troubleshooting assistant** | Gives generic fixes without context. | Finds matching errors and documented solutions. |
| 10 | **Answer with sources** | Answers can be hard to verify. | Includes references to retrieved documents. |
5. What are 10 LLM limitations that RAG helps solve? Explain in a simple table.
| # | LLM limitation without retrieval | How RAG helps |
|---|---|---|
| 1 | **Context limit:** Cannot fit unlimited text. | Sends only relevant sections. |
| 2 | **Token cost:** Processing whole documents costs more. | Sends fewer tokens. |
| 3 | **Outdated knowledge:** Training misses later updates. | Retrieves updated information. |
| 4 | **Private data:** Does not know your internal documents. | Retrieves authorized private content. |
| 5 | **Hallucination:** May invent answers. | Provides facts to support answers. |
| 6 | **Missing sources:** Cannot reliably identify supporting documents. | Supplies sources for citations. |
| 7 | **Exact details:** May misremember names, dates, or numbers. | Retrieves the original details. |
| 8 | **Specialized knowledge:** May lack your domain’s information. | Retrieves relevant expert documents. |
| 9 | **Scattered information:** Does not automatically search your files. | Finds relevant content across sources. |
| 10 | **Knowledge updates:** Training again is expensive. | Updates the searchable documents without retraining. |

5. Why is sending a 400-page PDF costly? How does RAG save tokens?
A large PDF contains many tokens, which cost money to process. RAG sends only the relevant chunks.

6. How does RAG avoid the context window limit?
It sends a small selection of relevant text instead of the whole document.

7. How does RAG reduce hallucination?
It gives the LLM supporting information, reducing guessing. Mistakes are still possible.

8. How does RAG work with a PDF?
Extract PDF text → split it → embed and store chunks → retrieve matching chunks → answer the question.

9. What are the two phases?
Indexing: prepare and store data.
Querying: retrieve information and answer questions.

10. What is indexing, and what does it produce?
Indexing prepares document chunks and their embeddings. It produces a searchable store for the query phase.

11. What is the query phase?
It takes your question, finds relevant chunks, and asks the LLM to answer using them.

===================indexing phase====================
1. What are the steps of indexing?
Read → Split into chunks → Create embeddings → Store.
Read the PDF.
Split it into small chunks.
Embed each chunk, which turns its text into numbers.
Store the chunks and their embeddings in Qdrant.
2. Reading: Load PDF text into memory.
Use PyPDFLoader. It reads the PDF and gives you one Document per page, with the text and the page number.

from langchain_community.document_loaders import PyPDFLoader
documents = PyPDFLoader("sample.pdf").load()


3. Chunking: Split text into smaller pieces.
Use RecursiveCharacterTextSplitter. It cuts the text into small pieces. chunk_overlap repeats some text between neighbouring chunks so a sentence isn't lost at a cut
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(    chunk_size=1000,    chunk_overlap=200)chunks = splitter.split_documents(documents)


Here, sizes are in characters. Overlap repeats some text between chunks. GitHub
4. Embedding: Convert chunks into lists of numbers representing meaning.
Create an OpenAIEmbeddings model. It turns each chunk into a list of numbers (a vector). Chunks with similar meaning get similar numbe

from langchain_openai import OpenAIEmbeddings
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")


This creates the embedding tool. Step 5 uses it to generate embeddings automatically. Set OPENAI_API_KEY in your environment.
5. Storing: Save chunks and their embeddings in Qdrant.
Use QdrantVectorStore.from_documents(). One call embeds all the chunks and saves the chunks and their vectors in a Qdrant collection.

from langchain_qdrant import QdrantVectorStore
vector_store = QdrantVectorStore.from_documents( documents=chunks,   embedding=embedding_model,    collection_name="sample_collection",    url="http://localhost:6333")


Qdrant must be running at that address. It stores the text, embeddings, and metadat
6. Does the indexing phase in RAG typically run in the background and handle the Create/Update/Delete operations of CRUD on the vector store?
Yes, RAG indexing often runs in the background. It adds vectors for new documents (Create), replaces affected chunks and vectors when documents change (Update), and removes them when documents are deleted (Delete).
These actions must be implemented in your indexing pipeline; they do not happen automatically. The query phase handles Read by retrieving relevant chunks.
7. How can I run the RAG indexing phase in the background so that the CRUD form submission returns immediately (showing a success message) without waiting for indexing to complete, and without impacting performance?

FastAPI BackgroundTasks: Runs after the response. Simple for small tasks, but shares API resources and tasks can be lost on restart.

Celery + Redis/RabbitMQ: Queues indexing for separate workers. Supports retries and controlled concurrency; suitable for heavier workloads.

RQ + Redis: A simpler job queue with separate Python workers. Useful when you need fewer features than Celery.

Database job table + worker: Save the document and pending job in one transaction. A separate worker picks up jobs and indexes them.

Scheduled batch indexing: A scheduled job indexes changed documents every few minutes. Simple, but search updates are delayed.

Event-driven indexing: Publish document-created, updated, or deleted events. An indexing service processes them independently.

8. What is the difference between chunk size and chunk overlap when splitting a document during the indexing phase of RAG

Suppose a document contains:
Tokens 1–1000
With:
chunk_size = 400
chunk_overlap = 50
The chunks might be:
Chunk 1: tokens 1–400
Chunk 2: tokens 351–750
Chunk 3: tokens 701–1000
Each new chunk starts 350 tokens after the previous one because:
So here:
Tokens 351–400 appear in both

Chunk size is the maximum length of each piece of text. Chunk overlap is the amount of text repeated between neighboring pieces to preserve context.
Example: chunk size = 5 words, chunk overlap = 2 words.

9. Does one token represent exactly one word?
No. One token does not necessarily represent one word.
A token can be:
A complete word: hello
Part of a word: play + ing
Punctuation: ., ?, ,
A number or symbol
Sometimes a space combined with a word, depending on the tokenizer
Modern LLMs usually use subword tokenization, such as BPE, WordPiece, or SentencePiece. These tokenizers split uncommon or long words into smaller pieces.�
Example
The sentence:
I am building a RAG system.
A tokenizer might produce something conceptually similar to:
["I", " am", " building", " a", " R", "AG", " system", "."]

10. What are the most commonly used parameters when splitting source data for RAG?
| Parameter | Simple meaning | Example |
|---|---|---|
| `chunk_size` | Maximum size of each text piece. | `500` characters |
| `chunk_overlap` | Text repeated between neighboring chunks to preserve context. | `50` characters |
| `separators` | Where to try splitting: paragraphs, sentences, or spaces. | `["\n\n", "\n", " ", ""]` |
| `length_function` | How to measure chunk size: characters, words, or tokens. | `len` counts characters in a string |
============code example===========
from langchain_text_splitters import RecursiveCharacterTextSplitter

text = """I love Python. It is easy to learn.

RAG splits text into chunks."""

splitter = RecursiveCharacterTextSplitter(
    chunk_size=25,                         # max 25 characters per chunk
    chunk_overlap=10,                      # up to 10 characters repeated between chunks
    separators=["\n\n", "\n", " ", ""],    # split by paragraph, then line, then word, then character
    length_function=len                    # measure size in characters
)

for i, chunk in enumerate(splitter.split_text(text), 1):
    print(i, chunk)
 =================output===============
1  I love Python. It is easy
2  is easy to learn.
3  RAG splits text into
4  text into chunks.
11. What are the most commonly used parameters when Embedding the chunks using OpenAI Embeddings in indexing phase
| Parameter | Simple meaning | Example |
|---|---|---|
| `model` | Which model converts text into numbers. | `"text-embedding-3-small"` |
| `dimensions` | How many numbers each embedding contains. | `1024` |
| `chunk_size` | Maximum number of texts sent in one batch. | `100` |
| `api_key` | Your key to access OpenAI; usually loaded from `OPENAI_API_KEY`. | Environment variable |
| `max_retries` | How many times to retry a failed request. | `3` |
| `request_timeout` | How many seconds to wait for a response. | `60` |
 
 from langchain_openai import OpenAIEmbeddings

# OPENAI_API_KEY is already set in your environment.
embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    dimensions=1024,
    chunk_size=100,
    max_retries=3,
    request_timeout=60
)

chunks = [
    "Python is a programming language.",
    "FastAPI is used to build APIs."
]

vectors = embedding_model.embed_documents(chunks)

print(len(vectors))     # 2 embeddings
print(len(vectors[0]))  # 1024 numbers per embedding


| Parameter | Default | Your setting | Simple guidance |
|---|---|---|---|
| `dimensions` | **3072** for `text-embedding-3-large` | `1024` | Smaller vectors save storage, with a possible loss in search accuracy. |
| `chunk_size` | `1000` texts per batch | `100` | Smaller batches are useful while testing. |
| `max_retries` | `2` | `3` | Allows one extra retry after a temporary failure. |
| `request_timeout` | `None` in LangChain; underlying client timeout applies | `60` seconds | Sets an explicit waiting limit. |
12. what are the most commonly used parameters when you Create a Qdrant Vector Store in indexing phase
| Parameter | Simple meaning | Example |
|---|---|---|
| `documents` | The document chunks you want to store. | `chunks` |
| `embedding` | The embedding model that converts chunks into numbers. | `embedding_model` |
| `collection_name` | The name of the collection where your data is saved—similar to a database table. | `"my_documents"` |
| `url` | The address of your Qdrant server. | `"http://localhost:6333"` |
| `api_key` | Your **Qdrant key**, if the server requires authentication. | Read from an environment variable |
| `ids` | Unique IDs for chunks, useful for updating or deleting them later. | A list of UUIDs |

from langchain_qdrant import QdrantVectorStore

vector_store = QdrantVectorStore.from_documents(
    documents=chunks,                    # Your document chunks
    embedding=embedding_model,           # Converts chunks into vectors
    collection_name="my_documents",      # Where data is saved
    url="http://localhost:6333"           # Running Qdrant server
)

13.  Can I index with one embedding model and query with another? or Can I use different embedding models for indexing and querying?
No. Indexing and querying must use the same embedding model and dimensions. Different models produce vectors in different "spaces", so they can't be compared.

Use the same model and dimensions for both so the vectors can be compared meaningfully.

14. Is the splitter's chunk_size the same as the embedding's chunk_size
No. In the text splitter, it's the size of each piece of text (characters or tokens). In OpenAIEmbeddings, it's how many chunks are sent per API call (batch size). Same name, different meaning.

15. Does chunk_size=100 in OpenAIEmbeddings mean 100 characters?
Golden rule: It means up to 100 texts per batch. The text splitter controls each chunk’s length.

16. Can I change the embedding model without updating stored vectors?
Golden rule: When changing models, re-embed all stored chunks. Changing dimensions also requires a matching vector collection.

17. Do I embed the entire document again whenever someone asks a question?
Golden rule: Embed documents during indexing. During querying, embed the question and search the stored vectors.
18. When a source document is deleted or updated, is the vector store updated automatically?
No. The vector store is a separate copy. You must delete or replace that document's chunks yourself, using IDs or metadata. Otherwise the app keeps answering from outdated or deleted content.
19. What is the difference between default and default_factory in Field()?

default provides a fixed value. default_factory calls a function to generate a value for each new object when no value is provided.
pages: int = Field(default=0)
uploaded_at: datetime = Field(default_factory=now)

20. How do you set the current date and time as the default for a model field when a new object is created?
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field

def now():
    return datetime.now(timezone.utc)

class Document(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    uploaded_at: datetime = Field(default_factory=now)
21. How do you specify the database table name when defining a SQLModel model?

class Document(SQLModel, table=True):
    __tablename__ = "documents"

  print(Document.__tablename__)
print(Chunk.__tablename__)  

22. Differnt way to connect the relationship attributes in both models.
===Using document:======
# Inside Document
chunks: list["Chunk"] = Relationship(back_populates="document")
# Inside Chunk
document: Optional[Document] = Relationship(back_populates="chunks")
======Using owner:=======
# Inside Document
chunks: list["Chunk"] = Relationship(back_populates="owner")
# Inside Chunk
owner: Optional[Document] = Relationship(back_populates="chunks")
23. Why use cascade="all, delete-orphan"?

it tells SQLAlchemy how operations on a document affect its chunks.
When you delete a parent document through the session, its related child chunks are also deleted.


 SQLAlchemy 2.0 Documentation
| Setting | Meaning |
|---|---|
| `all` | Applies related session operations to chunks, including saving and deleting |
| `delete-orphan` | Deletes a chunk when it is removed from its parent relationship |

Document 1: deleted
Its two chunks: deleted
24. How do you configure a relationship to automatically delete related child records when the parent record is deleted?
Use sa_relationship_kwargs={"cascade": "all, delete-orphan"} in Relationship() for automatically deleting related child records when the parent is deleted through the session and committed.

chunks: list["Chunk"] = Relationship(
    back_populates="document",
    sa_relationship_kwargs={"cascade": "all, delete-orphan"},
)

sa_relationship_kwargs means:
- sa → SQLAlchemy
- relationship → Relationship
- kwargs → Keyword arguments
Together: SQLAlchemy relationship keyword arguments—extra named settings passed to SQLAlchemy’s relationship.
kwargs means “keyword arguments”—settings passed by name.
Here, you pass extra settings to SQLAlchemy’s relationship:
25. Why use ondelete="CASCADE"?
It tells the database itself:
When a document row is deleted, delete its related chunk rows.

ForeignKey("documents.id", ondelete="CASCADE")

This works even when deletion happens through direct SQL, provided the database foreign key constraint exists and is enforced
| Setting | Who handles it? | Purpose |
|---|---|---|
| `cascade="all, delete-orphan"` | SQLAlchemy | Handles related objects during session operations, including removed chunks |
| `ondelete="CASCADE"` | Database | Deletes child rows when the parent row is deleted |

Deleting a chunk does not delete its document.
26. How do you define a database column using SQLAlchemy settings inside a SQLModel field?
: Use sa_column=Column(...) inside Field().
It lets you define the database column directly using SQLAlchemy settings.
document_id: int = Field(
    sa_column=Column(
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
)
27. Difference between  normal column, and database column
Both are database columns. “Normal column” just means a column defined using simple Field() settings.
| Using `Field()` | Using `Field(sa_column=Column(...))` |
|---|---|
| SQLModel creates the column for you | You explicitly define the SQLAlchemy column |
| Convenient for common fields | Useful for custom database settings or types |

# Simple integer database column
id: Optional[int] = Field(default=None, primary_key=True)

# PostgreSQL array database column
embedding: list[float] = Field(
    sa_column=Column(ARRAY(Float), nullable=False)
)
28. How do you store a list of decimal numbers in a PostgreSQL database column using SQLAlchemy?
Use ARRAY(Float) inside Column():
embedding: list[float] = Field(
    sa_column=Column(ARRAY(Float), nullable=False)
)
output
embedding = [0.12, -0.45, 0.78]
29. How do you store a list of dictionaries in a PostgreSQL JSONB column using SQLModel, with an empty list as the default?
sources: list[dict] = Field(
    default_factory=list,
    sa_column=Column(JSONB, nullable=False)
)

output
[{'filename': 'python.pdf', 'page': 1}, {'filename': 'guide.pdf', 'page': 3}]

===Dictionary of lists==
# Inside your model
sources: dict[str, list[str]] = Field(
    default_factory=dict,
    sa_column=Column(JSONB, nullable=False)
)

{'filenames': ['python.pdf', 'guide.pdf'], 'topics': ['Python', 'FastAPI']}

===List of lists====
# Inside your model
sources: list[list[int]] = Field(
    default_factory=list,
    sa_column=Column(JSONB, nullable=False)
)

  numbers: list[list[int]] = Field(
        default_factory=list,
        sa_type=JSONB,
        nullable=False
    )


[[1, 2, 3], [4, 5, 6]]

==========Dictionary of dictionaries======

# Inside your model
sources: dict[str, dict[str, str]] = Field(
    default_factory=dict,
    sa_column=Column(JSONB, nullable=False)
)

{'source1': {'filename': 'python.pdf', 'topic': 'Python'}, 'source2': {'filename': 'guide.pdf', 'topic': 'FastAPI'}}

30. How do you define a SQLModel response so that sources is returned as a list of Source objects?

class QueryResponse(SQLModel):
    id: int
    question: str
    answer: str
    sources: list[Source]
    created_at: datetime

 ====output======
 {
  "id": 1,
  "question": "What is Python?",
  "answer": "Python is a programming language.",
  "sources": [
    {
      "filename": "python.pdf",
      "page": 1
    },
    {
      "filename": "guide.pdf",
      "page": 3
    }
  ],
  "created_at": "2026-10-07T09:00:00Z"
}   

31. What is the difference between reading a PDF using PyPDFLoader with loader.load() and using PdfReader with page.extract_text()?


| Point | `PyPDFLoader` | `PdfReader` in your code |
|---|---|---|
| **Input** | PDF file path | PDF bytes, such as an uploaded file |
| **Extract text** | `loader.load()` does it for you | You call `page.extract_text()` |
| **Output** | Documents containing **text + metadata** | Your `texts` list contains **only text** |
| **Read first page’s text** | `docs[0].page_content` | `texts[0]` |

# PyPDFLoader: document with text and metadata
docs[0].page_content   # "Python is easy to learn."
docs[0].metadata       # Information such as source and page

# Your PdfReader code: text string
texts[0]              # "Python is easy to learn."

32. How do you extract text from each page of a PDF when you have the file as bytes?
Use PdfReader with io.BytesIO(), then extract text from each page
import io
from pypdf import PdfReader

# data contains the PDF bytes
reader = PdfReader(io.BytesIO(data))

for page in reader.pages:
    print(page.extract_text() or "")
output
Text from the first page.
Text from the second page.     
33. How do you extract text from each page of a PDF when you know its file path?
Use PyPDFLoader, then access each page’s text:
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("data/sample.pdf")
docs = loader.load()

for doc in docs:
    print(doc.page_content)

output
Text from the first page.
Text from the second page.    
34. How do you get both the page number and the page object while looping through PDF pages, starting the page number at 1?
Use enumerate() with start=1
for page_no, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ""
    print(page_no, text)
page_no → page number: 1, 2, 3...
page → page object, used to extract text.
start=1 → begins numbering at 1.
===output================
1 Text from the first page.
2 Text from the second page.
35. How do you split text into chunks and add each chunk with its page number as a (page_no, chunk) pair to the pieces list?
pieces.extend(
    (page_no, chunk)
    for chunk in splitter.split_text(text)
)
====full code with output======
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

pieces: list[tuple[int, str]] = []

for page_no, page in enumerate(reader.pages, start=1):
    text = (page.extract_text() or "").strip()

    pieces.extend(
        (page_no, chunk)
        for chunk in splitter.split_text(text)
    )
=====output================    
pieces = [
    (1, "AI is useful."),
    (2, "RAG retrieves information.")
]    
36. how to store chunks as LangChain documents
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=400
)

chunks = text_splitter.split_documents(documents=docs)
Each resulting document contains chunk text and copied source metadata.
Example result, assuming these metadata values were in docs:

[
    Document(
        page_content="AI is useful.",
        metadata={"source": "sample.pdf", "page": 0}
    ),
    Document(
        page_content="RAG retrieves information.",
        metadata={"source": "sample.pdf", "page": 1}
    )
]
37. How do you extract only the text from a list of (page_number, text) pairs, and what does _ mean?
pieces = [
    (1, "AI is useful."),
    (2, "RAG retrieves information.")
]

texts = [text for _, text in pieces]

print(texts)  ====output  ['AI is useful.', 'RAG retrieves information.']
======in other simple way============
texts = []

for page_no, text in pieces:
    texts.append(text)

| Pair | `_` receives | `text` receives |
| -- | -- | -- |
| `(1, "AI is useful.")` | `1` | `"AI is useful."` |
| `(2, "RAG retrieves information.")` | `2` | `"RAG retrieves information."` |

38. How do you create vectors from text?
texts = ["AI is useful.", "RAG retrieves information."]

vectors = embedding_model.embed_documents(texts)
output
[
    [0.12, -0.34, 0.56, ...],
    [0.78, 0.21, -0.45, ...]
]
39. How do you create vectors and store them in Qdrant in one step?
see C:\Users\rakes\PycharmProjects\fastapi\rag\app\index.py
embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    api_key=os.getenv("OPENAI_API_KEY")
)

# Create a Qdrant Vector Store
vector_store = QdrantVectorStore.from_documents(
    documents=chunks,
    embedding=embedding_model,
    collection_name="sample_collection",
    url="http://localhost:6333"
)

40. Which Python function should you use in a for loop to repeat something a fixed number of times? or

for i in range(0, 6, 2):
    print(i)
===output===
0
2
4    
Starts at 0, stops before 6, and increases by 2.
41. Which Python function should you use in a for loop to generate positions with a step, such as 0, 100, 200, for processing batches?
texts = ["sample text"] * 250
for i in range(0, len(texts), 100):
    batch = texts[i:i + 100]
    print("Start:", i, "Batch size:", len(batch))

 output
Start: 0 Batch size: 100
Start: 100 Batch size: 100
Start: 200 Batch size: 50   

42. How do you send texts to OpenAI in batches of 100 and collect all the returned embedding vectors in one list?
vectors = []

for i in range(0, len(texts), 100):
    batch = texts[i:i + 100]

    res = client().embeddings.create(
        model=EMBEDDING_MODEL,
        input=batch
    )

    vectors.extend(d.embedding for d in res.data)

    print("Batch start:", i)
    print("Texts sent:", len(batch))
    print("Total vectors:", len(vectors))
============output============
    Batch start: 0
Texts sent: 100
Total vectors: 100

Batch start: 100
Texts sent: 100
Total vectors: 200

Batch start: 200
Texts sent: 50
Total vectors: 250
===print(vectors)=====
[
    [0.12, -0.03, 0.45],  # Text 1
    [0.28, 0.17, -0.09],  # Text 2
    # ...remaining vectors...
]
43. Given the following inputs, how does Python extract the page number, text, and corresponding vector using zip() to create Chunk objects? What will doc.chunks contain?

doc.chunks = [
    Chunk(page=page, content=text, embedding=vec)
    for (page, text), vec in zip(pieces, vectors)
]

output 
((1, "AI helps automate tasks."), [0.12, -0.03, 0.45])
((1, "Machine learning learns from data."), [0.28, 0.17, -0.09])
((2, "Vectors represent text as numbers."), [0.06, 0.31, 0.22])

44. How can you use Python’s zip() to create a list of tuples, a tuple of tuples, and a dictionary, and iterate over its results with and without unpacking? Show a simple example and output for each format.
names = ["Ashwani", "Rahul"]
ages = [25, 30]

| Format | Code | Result |
|---|---|---|
| List of tuples | `list(zip(names, ages))` | `[('Ashwani', 25), ('Rahul', 30)]` |
| Tuple of tuples | `tuple(zip(names, ages))` | `(('Ashwani', 25), ('Rahul', 30))` |
| Dictionary | `dict(zip(names, ages))` | `{'Ashwani': 25, 'Rahul': 30}` |
| Loop with whole pair | `for pair in zip(names, ages):` | `pair = ('Ashwani', 25)` on first iteration |
| Loop with unpacking | `for name, age in zip(names, ages):` | `name = 'Ashwani'`, `age = 25` on first iteration |

45. Can Python’s zip() be used in different formats, such as iterating with a single pair variable or unpacking into separate variables? Explain both with examples and output.
pieces = [(1, "AI is useful.")]
vectors = [[0.12, 0.45]]

for pair in zip(pieces, vectors):
    print(pair)

 ((1, 'AI is useful.'), [0.12, 0.45])   

 for (page, text), vector in zip(pieces, vectors):
    print(page, text, vector)

    1 AI is useful. [0.12, 0.45]
    