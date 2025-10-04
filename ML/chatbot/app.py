import os
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

# Your existing chatbot imports
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore

# Initialize FastAPI app
app = FastAPI(
    title="ASHA Worker Chatbot API",
    description="AI companion for ASHA workers to explain government health schemes",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    # session_id: str
    timestamp: str

# Global variable for chatbot chain
retrieval_chain = None

def initialize_chatbot():
    """Initialize chatbot components"""
    global retrieval_chain
    
    try:
        # Initialize Pinecone
        pinecone_api_key = os.environ.get("PINECONE_API_KEY")
        pc = Pinecone(api_key=pinecone_api_key)
        pinecone_index_name = "asha"

        # Initialize embeddings
        embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            openai_api_key="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"
        )

        # Initialize LLM
        llm = ChatOpenAI(
            model="google/gemini-2.5-flash",
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=os.environ.get("OPENROUTER_API_KEY"),
        )

        # Connect to Pinecone index
        print("Connecting to Pinecone index...")
        db = PineconeVectorStore.from_existing_index(
            index_name=pinecone_index_name,
            embedding=embeddings
        )

        # Create prompt template
        prompt = ChatPromptTemplate.from_template("""
        You are "Sahaya Mitra" (Helping Friend), an empathetic AI companion designed specifically for ASHA workers in rural India. Your primary role is to explain government health schemes in simple, understandable English while providing emotional support and practical guidance.

        🚨 RULE #1: LANGUAGE MATCHING (Highest Priority)
        User Message Type	Response Language
        Pure English	English
        Hinglish (mix of Hindi+English in Roman script)	Hindi
        Pure Hindi (Devanagari script)	Hindi

        Example:
        User: "Mujhe health schemes ke baare mein batao" → Hinglish → Respond in Hindi

        ⚙️ RESPONSE TYPES

        1. Scheme Query:
        If found → Use Scheme Found Template
        If not found → Use Scheme Not Found Template

        2. Health Guidance:
        Give preventive or general advice with disclaimer.
        Do not diagnose or prescribe.

        3. Emergency:
        If message contains "not breathing", "unconscious", "severe bleeding", etc. →
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

        ❌ DON'Ts

        Don't mix languages

        Don't show system tags or metadata

        Don't invent details or guess

        Don't diagnose or prescribe

        🎯 Success Rule:
        ✅ 100% Language Match
        ✅ Clean, factual output
        ✅ Supportive tone

        <context>
        {context}
        </context>

        Question: {input}
        """)

        # Create chains
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = db.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        print("✅ Chatbot initialized successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error initializing chatbot: {e}")
        return False

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize chatbot on startup"""
    success = initialize_chatbot()
    if not success:
        raise Exception("Failed to initialize chatbot components")

# Simple in-memory storage for sessions (optional)
sessions = {}

# Endpoint 1: Health check
@app.get("/")
async def health_check():
    return {
        "status": "healthy", 
        "message": "ASHA Worker Chatbot API is running!",
        "timestamp": datetime.now().isoformat()
    }

# Endpoint 2: Chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest):
    """Main chat endpoint - accepts user query and returns chatbot response"""
    
    if retrieval_chain is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")
    
    try:
        # Generate or use session ID
        # session_id = chat_request.session_id or str(uuid.uuid4())
        
        # Get response from chatbot
        response = retrieval_chain.invoke({"input": chat_request.message})
        
        # Store session (optional)
        # if session_id not in sessions:
        #     sessions[session_id] = {
        #         'created_at': datetime.now().isoformat(),
        #         'message_count': 0
        #     }
        # sessions[session_id]['message_count'] += 1
        
        return ChatResponse(
            response=response["answer"],
            # session_id=session_id,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)