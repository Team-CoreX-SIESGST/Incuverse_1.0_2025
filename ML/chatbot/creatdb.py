import os
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
from dotenv import load_dotenv
load_dotenv()

import textwrap
import sys
from langchain_community.document_loaders import TextLoader
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.documents import Document
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

# Initialize Pinecone
pinecone_api_key = os.environ.get("PINECONE_API_KEY")
pc = Pinecone(api_key=pinecone_api_key)

# Define your index name
pinecone_index_name = "asha"


# if pinecone_index_name in pc.list_indexes().names():
#     pc.delete_index(pinecone_index_name)
#     print(f"Deleted existing index '{pinecone_index_name}'")


# pc.create_index(
#     name=pinecone_index_name,
#     dimension=1536,  # This must match your embedding model
#     metric="cosine",
#     spec=ServerlessSpec(
#         cloud="aws",
#         region="us-east-1"
#     )
# )

print(f"Created new index '{pinecone_index_name}' with dimension 1536")

# Initialize embeddings
embeddings = OpenAIEmbeddings(
    model="text-embedding-ada-002",  # This model has 1536 dimensions
    openai_api_key="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"
)

# Initialize LLM
llm = ChatOpenAI(
    model="google/gemini-2.5-flash",
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=os.environ.get("OPENROUTER_API_KEY"),
)

# # Now create the vector store
pinecone_api_key = os.environ.get("PINECONE_API_KEY")
pinecone_index_name = "asha"
print(f"Connecting to existing Pinecone index '{pinecone_index_name}'...")
db = PineconeVectorStore.from_existing_index(
        index_name=pinecone_index_name,
        embedding=embeddings
    )

print("Successfully connected to the existing Pinecone index.")









# documents_path = "/Users/vedantprashantbhosale/Desktop/kjhack/Incuverse_1.0_2025/ML/chatbot/data.txt"


# print(f"Loading documents from '{documents_path}'...")
# try:
#     loader = TextLoader(documents_path)
#     text_documents = loader.load()
#     print("Documents loaded successfully.")
# except FileNotFoundError:
#     print(f"Error: The file '{documents_path}' was not found. Please check the file path and name.", file=sys.stderr)
#     sys.exit(1)
# except Exception as e:
#     print(f"An unexpected error occurred while loading the document file: {e}", file=sys.stderr)
#     sys.exit(1)

# text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
# documents = text_splitter.split_documents(text_documents)


# import os
# os.environ["PINECONE_API_KEY"] = pinecone_api_key

# db = PineconeVectorStore.from_documents(
# 	documents=documents,
# 	index_name="asha",
# 	embedding=embeddings  # Use the embeddings object already defined
# )
# print("Documents have been upserted to the Pinecone index.")



from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""
You are "Sahaya Mitra" (Helping Friend), an empathetic AI companion designed specifically for ASHA workers in rural India. Your primary role is to explain government health schemes in simple, understandable English while providing emotional support and practical guidance.

🚨 RULE #1: LANGUAGE MATCHING (Highest Priority)
User Message Type	Response Language
Pure English	English
Hinglish (mix of Hindi+English in Roman script)	Hindi
Pure Hindi (Devanagari script)	Hindi

Example:
User: “Mujhe health schemes ke baare mein batao” → Hinglish → Respond in Hindi

⚙️ RESPONSE TYPES

1. Scheme Query:
If found → Use Scheme Found Template
If not found → Use Scheme Not Found Template

2. Health Guidance:
Give preventive or general advice with disclaimer.
Do not diagnose or prescribe.

3. Emergency:
If message contains “not breathing”, “unconscious”, “severe bleeding”, etc. →
→ Use Emergency Template immediately and tell to call 108.

🧾 RESPONSE TEMPLATES

(A) Scheme Found (English)
I found this scheme:
[Scheme Name]

Eligibility: [details]

Benefits: [details]

Application Process: [steps]

Helpline: [number]

For latest info, contact the official department.

(B) Scheme Found (Hindi)
मुझे यह योजना मिली है:
[योजना का नाम]

पात्रता: [विवरण]

लाभ: [विवरण]

आवेदन प्रक्रिया: [चरण]

हेल्पलाइन: [नंबर]

नवीनतम जानकारी के लिए आधिकारिक विभाग से संपर्क करें।

(C) Emergency (Hindi)
⚠️ यह एक चिकित्सा आपातकाल है।

तुरंत 108 पर कॉल करें।

रोगी को निकटतम स्वास्थ्य केंद्र ले जाएं।

किसी भी कारण से देरी न करें।

✅ DOs

Always match user language

Use database-only info for schemes

Include disclaimers for health guidance

Be empathetic and clear

❌ DON’Ts

Don’t mix languages

Don’t show system tags or metadata

Don’t invent details or guess

Don’t diagnose or prescribe

🎯 Success Rule:
✅ 100% Language Match
✅ Clean, factual output
✅ Supportive tone

<context>
{context}
</context>

Question: {input}
""")


document_chain = create_stuff_documents_chain(llm, prompt)
retriever = db.as_retriever()
retrieval_chain = create_retrieval_chain(retriever, document_chain)


response = retrieval_chain.invoke({"input":"Mujhe health schemes ke baare mein batao vistar se"})

print(response["answer"])
