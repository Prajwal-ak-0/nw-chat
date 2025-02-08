import sqlite3
from typing import Optional, Tuple
import os

class DatabaseManager:
    def __init__(self, db_path: str = "conversations.db"):
        self.db_path = db_path
        self.init_db()

    def init_db(self):
        """Initialize the database with schema"""
        if not os.path.exists(self.db_path):
            with sqlite3.connect(self.db_path) as conn:
                with open('schema.sql', 'r') as f:
                    conn.executescript(f.read())

    def get_or_create_conversation(self, session_id: str) -> int:
        """Get existing conversation ID or create new one"""
        with sqlite3.connect(self.db_path) as conn:
            # Try to get existing conversation
            cursor = conn.execute(
                "SELECT id FROM conversations WHERE session_id = ?",
                (session_id,)
            )
            result = cursor.fetchone()
            
            if result:
                return result[0]
            
            # Create new conversation
            cursor = conn.execute(
                "INSERT INTO conversations (session_id) VALUES (?)",
                (session_id,)
            )
            conn.commit()
            return cursor.lastrowid

    def get_previous_context(self, session_id: str) -> Optional[str]:
        """Get the previous context summary for a session"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT context_summary FROM conversations WHERE session_id = ?",
                (session_id,)
            )
            result = cursor.fetchone()
            return result[0] if result else ""

    def update_context_summary(self, conversation_id: int, context_summary: str):
        """Update the context summary for a conversation"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE conversations SET context_summary = ? WHERE id = ?",
                (context_summary, conversation_id)
            )
            conn.commit()

    def save_message(self, conversation_id: int, content: str, role: str) -> int:
        """Save a message and return its ID"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "INSERT INTO messages (conversation_id, content, role) VALUES (?, ?, ?)",
                (conversation_id, content, role)
            )
            conn.commit()
            return cursor.lastrowid

    def get_conversation_messages(self, conversation_id: int) -> list:
        """Get all messages for a conversation"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT content, role FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
                (conversation_id,)
            )
            return cursor.fetchall()
