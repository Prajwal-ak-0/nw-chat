import os
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import openai
from fastapi.responses import StreamingResponse
import asyncio

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# Pydantic model for chat request
from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str

    def is_relevant_query(self) -> bool:
        # List of keywords related to HITL and Gen AI
        hitl_keywords = [
            'human in the loop', 'hitl', 'human feedback', 'human evaluation',
            'human annotation', 'human review', 'human verification', 'human validation',
            'human oversight', 'human intervention', 'human interaction', 'human input'
        ]
        
        gen_ai_keywords = [
            'generative ai', 'large language model', 'llm', 'gpt', 'transformer',
            'neural network', 'machine learning', 'deep learning', 'ai model',
            'prompt engineering', 'fine-tuning', 'model training', 'ai safety',
            'model evaluation', 'ai alignment'
        ]
        
        query_lower = self.query.lower()
        return any(keyword in query_lower for keyword in hitl_keywords + gen_ai_keywords)

@app.get("/")
async def root():
    return {"message": "Welcome to the Chat API"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Check if query is relevant
        if not request.is_relevant_query():
            return {
                "response": "I apologize, but I can only assist with questions specifically related to Human-in-the-Loop (HITL) systems and Generative AI technologies. Your query appears to be outside these domains. Please rephrase your question to focus on topics such as:\n\n- HITL implementation strategies\n- Human-AI collaboration\n- AI model training and evaluation\n- Prompt engineering\n- AI safety and alignment\n- Human feedback systems\n\nFor example, instead of general questions, you could ask:\n'How can I implement HITL in my AI system?'\n'What are best practices for collecting human feedback?'\n'How do I evaluate LLM outputs using human reviewers?'",
                "status": "error"
            }

        # Define the specialized prompt template
        system_prompt = """
        <role>Technical Consultant for HITL and GenAI Systems Only!!!</role>

        <expertise>
            <hitl>
            - System Architecture
            - Human-AI Collaboration
            - Feedback Integration
            - Quality Assurance
            - Workflow Design
            - Metrics & Evaluation
            </hitl>

            <genai>
            - LLM Systems
            - Model Training
            - Prompt Engineering
            - AI Safety
            - Model Evaluation
            </genai>
        </expertise>

        <rules>
            1. Reject non-HITL/GenAI queries
            2. No creative/general content
            3. Technical focus only
            4. Implementation-based answers
            5. Industry standards only
        </rules>

        <rejection_message>Sorry, I can only assist with questions specifically related to Human-in-the-Loop (HITL) systems and Generative AI technologies. Your query appears to be outside these domains.</rejection_message>
        <query>{query}</query>
        """

        # Make OpenAI API call with the specialized prompt
        response = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt.format(query=request.query)}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # Extract the assistant's response
        assistant_response = response.choices[0].message.content
        
        return {
            "response": assistant_response,
            "status": "success"
        }
    except Exception as e:
        error_message = str(e)
        return {
            "response": f"Error: {error_message}",
            "status": "error"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)