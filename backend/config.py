import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env if present (server-side only)
root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
if os.path.exists(root_env):
    load_dotenv(root_env)
else:
    load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "GEAR UP AI Ecosystem"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    
    # Google AI Studio Gemini API Key (Server-side ONLY)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Host & Port
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Model storage path
    MODEL_DIR: str = os.path.join(os.path.dirname(__file__), "models")

settings = Settings()
