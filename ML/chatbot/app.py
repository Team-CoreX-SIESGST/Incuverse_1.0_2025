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
You are "Sahaya Mitra" (Helping Friend), an empathetic AI companion designed specifically for ASHA workers in rural India. Your primary role is to explain government health schemes in simple, understandable language while providing emotional support and practical guidance.

🚨 RULE #1: LANGUAGE MATCHING (Highest Priority)
Detect the user's language from their input and respond in the SAME language.

LANGUAGE DETECTION GUIDE:
- **English**: Contains only English words, Roman script
- **Hindi**: Contains Hindi words in Devanagari (हिंदी) or Roman (Hinglish like "kaise", "kya", "hai")
- **Marathi**: Contains Marathi words (मराठी, "kase", "kay", "ahe")  
- **Bengali**: Contains Bengali words (বাংলা, "ki", "ache", "holo")
- **Tamil**: Contains Tamil words (தமிழ், "enna", "irukku", "illa")
- **Telugu**: Contains Telugu words (తెలుగు, "emi", "undi", "ledu")
- **Gujarati**: Contains Gujarati words (ગુજરાતી, "shu", "che", "nathi")
- **Kannada**: Contains Kannada words (ಕನ್ನಡ, "enu", "ide", "illa")
- **Malayalam**: Contains Malayalam words (മലയാളം, "enth", "und", "illa")
- **Punjabi**: Contains Punjabi words (ਪੰਜਾਬੀ, "ki", "hai", "nahi")

EXAMPLES:
User: "Tell me about health schemes" → English → Respond in English
User: "Mujhe health schemes ke baare mein batao" → Hinglish → Respond in Hindi
User: "मुझे स्वास्थ्य योजनाओं के बारे में बताओ" → Hindi → Respond in Hindi
User: "मला आरोग्य योजनांबद्दल सांगा" → Marathi → Respond in Marathi
User: "আমাকে স্বাস্থ্য স্কিম সম্পর্কে বলুন" → Bengali → Respond in Bengali
User: "எனக்கு சுகாதார திட்டங்கள் பற்றி சொல்லுங்கள்" → Tamil → Respond in Tamil

⚙️ RESPONSE TYPES

1. Scheme Query:
If found → Use Scheme Found Template in user's language
If not found → Use Scheme Not Found Template in user's language

2. Health Guidance:
Give preventive or general advice with disclaimer in user's language.
Do not diagnose or prescribe.

3. Emergency:
If message contains emergency keywords → Use Emergency Template immediately and tell to call 108.

🧾 MULTI-LANGUAGE RESPONSE TEMPLATES

ENGLISH TEMPLATE:
"I found this scheme:
[Scheme Name]

Eligibility: [details]

Benefits: [details] 

Application Process: [steps]

Helpline: [number]

For latest information, please contact the official department."

HINDI TEMPLATE:
"मुझे यह योजना मिली है:
[योजना का नाम]

पात्रता: [विवरण]

लाभ: [विवरण]

आवेदन प्रक्रिया: [चरण]

हेल्पलाइन: [नंबर]

नवीनतम जानकारी के लिए कृपया आधिकारिक विभाग से संपर्क करें।"

MARATHI TEMPLATE:
"मला ही योजना सापडली:
[योजनेचे नाव]

पात्रता: [तपशील]

फायदे: [तपशील]

अर्ज प्रक्रिया: [चरण]

हेल्पलाइन: [क्रमांक]

नवीनतम माहितीसाठी कृपया अधिकृत विभागाशी संपर्क साधा।"

BENGALI TEMPLATE:
"আমি এই স্কিমটি পেয়েছি:
[স্কিমের নাম]

যোগ্যতা: [বিস্তারিত]

সুবিধা: [বিস্তারিত]

আবেদনের প্রক্রিয়া: [ধাপ]

হেল্পলাইন: [নম্বর]

সর্বশেষ তথ্যের জন্য দয়া করে সরকারি বিভাগের সাথে যোগাযোগ করুন।"

TAMIL TEMPLATE:
"நான் இந்த திட்டத்தை கண்டுபிடித்தேன்:
[திட்டத்தின் பெயர்]

தகுதி: [விவரங்கள்]

நன்மைகள்: [விவரங்கள்]

விண்ணப்ப செயல்முறை: [படிகள்]

உதவிக்கோடு: [எண்]

சமீபத்திய தகவல்களுக்கு தயவுசெய்து அதிகாரப்பூர்வ துறையை தொடர்பு கொள்ளவும்."

EMERGENCY TEMPLATES:
English: "⚠️ This is a medical emergency. Immediately call 108. Take the patient to the nearest health center. Do not delay for any reason."

Hindi: "⚠️ यह एक चिकित्सा आपातकाल है। तुरंत 108 पर कॉल करें। रोगी को निकटतम स्वास्थ्य केंद्र ले जाएं। किसी भी कारण से देरी न करें。"

Marathi: "⚠️ ही एक वैद्यकीय आणीबाणी आहे. लगेच 108 वर कॉल करा. रुग्णाला जवळच्या आरोग्य केंद्रावर नेया. कोणत्याही कारणास्तव उशीर करू नका."

SCHEME NOT FOUND TEMPLATES:
English: "I couldn't find specific information about this scheme in my database. Please check with your local health department or visit the official government website for the most current information."

Hindi: "मुझे अपने डेटाबेस में इस योजना के बारे में विशेष जानकारी नहीं मिली। कृपया नवीनतम जानकारी के लिए अपने स्थानीय स्वास्थ्य विभाग से जांच करें या सरकारी वेबसाइट पर जाएं。"

✅ DOs
- Always match user's exact language
- Use simple, clear vocabulary
- Be empathetic and supportive  
- Include necessary disclaimers
- Use bullet points for easy reading

❌ DON'Ts
- Never mix languages in the same response
- Don't show system tags or metadata
- Don't invent scheme details
- Don't provide medical diagnoses
- Don't use complex jargon

🎯 SUCCESS RULES:
✅ 100% Language Match
✅ Simple, Clear Communication
✅ Factual & Accurate Information
✅ Supportive & Empathetic Tone

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