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

# Configure CORS for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nw-chat.vercel.app",  # Production frontend
        "http://localhost:3000",      # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# Pydantic model for chat request
from pydantic import BaseModel

class ChatRequest(BaseModel):
    query: str
    session_id: str = "first_query"

    # No keyword check needed as LLM will handle topic filtering

@app.get("/")
async def root():
    return {"message": "Welcome to the Chat API"}

from db_manager import DatabaseManager
from prompt_templates import PromptTemplates

# Initialize database manager
db = DatabaseManager()

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        try:
            # Get or create conversation
            conversation_id = db.get_or_create_conversation(request.session_id)

            # Get previous context
            previous_context = db.get_previous_context(request.session_id)

            # Save user message
            db.save_message(conversation_id, request.query, "user")

            # For follow-up queries, use the query directly with context
            if previous_context:
                system_prompt = """
                <role>Technical Consultant for HITL and GenAI Systems</role>
                <context>{context}</context>
                <query>{query}</query>
                """

                response = await asyncio.wait_for(
                    openai.ChatCompletion.acreate(
                        model="gpt-4o-mini",
                        messages=[{
                            "role": "system",
                            "content": system_prompt.format(
                                query=request.query,
                                context=previous_context
                            )
                        }],
                        temperature=0.7,
                        max_tokens=1000
                    ),
                    timeout=30.0  # 30 second timeout
                )
                
                assistant_response = response.choices[0].message.content
                new_context_summary = previous_context  # Keep the same context for follow-ups

            else:
                # For first query, use the full system
                system_prompt = """
                <role>Technical Consultant for HITL and GenAI Systems</role>
                <expertise>
                    - System Architecture
                    - Human-AI Collaboration
                    - Feedback Integration
                    - Quality Assurance
                    - Workflow Design
                    - Metrics & Evaluation
                </expertise>
                <query>{query}</query>
                """

                response = await asyncio.wait_for(
                    openai.ChatCompletion.acreate(
                        model="gpt-4o-mini",
                        messages=[{
                            "role": "system",
                            "content": system_prompt.format(query=request.query)
                        }],
                        temperature=0.7,
                        max_tokens=1000
                    ),
                    timeout=30.0  # 30 second timeout
                )
                
                assistant_response = response.choices[0].message.content

                # Generate conversation summary using LLM
                summary_prompt = PromptTemplates.get_context_summary_prompt(
                    previous_summary=previous_context,
                    query=request.query,
                    response=assistant_response
                )

                summary_response = await asyncio.wait_for(
                    openai.ChatCompletion.acreate(
                        model="gpt-4o-mini",
                        messages=[{"role": "system", "content": summary_prompt}],
                        temperature=0.7,
                        max_tokens=500
                    ),
                    timeout=30.0
                )

                new_context_summary = summary_response.choices[0].message.content

            # Save assistant message and update context
            db.save_message(conversation_id, assistant_response, "assistant")
            db.update_context_summary(conversation_id, new_context_summary)
            
            return {
                "response": assistant_response,
                "status": "success",
                "conversation_id": conversation_id
            }

        except asyncio.TimeoutError:
            return {
                "response": "Request timed out. Please try again.",
                "status": "error",
                "conversation_id": None
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