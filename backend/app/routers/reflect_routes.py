import json
import os

from fastapi import APIRouter, Depends, HTTPException
from google import genai

from ..auth import get_current_user
from ..models import User
from ..schemas import ReflectRequest, ReflectResponse

router = APIRouter(prefix="/api/reflect", tags=["reflect"])

_client = None


def get_client():
    global _client
    if _client is None:
        if not os.environ.get("GEMINI_API_KEY"):
            raise HTTPException(
                status_code=500,
                detail="GEMINI_API_KEY is not set on the server. Add it to backend/.env",
            )
        _client = genai.Client()
    return _client


REFLECTION_PROMPT = """
You are analyzing a journal entry using CBT-inspired reflection.

The prompt was: {prompt}

User response:
{text}

Respond with ONLY a JSON object (no markdown, no code fences) matching exactly
this shape:

{{
  "summary": "1-2 sentence summary",
  "patterns": ["3 to 5 short bullet points naming possible thinking patterns"],
  "questions": ["2 to 3 CBT-style reflection questions"],
  "action": "one small, concrete action step the user can take"
}}
"""


@router.post("", response_model=ReflectResponse)
def reflect(payload: ReflectRequest, current_user: User = Depends(get_current_user)):
    client = get_client()

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=REFLECTION_PROMPT.format(prompt=payload.prompt, text=payload.text),
        )
        raw = response.text.strip()
        # Models sometimes wrap JSON in ```json fences despite instructions — strip them.
        if raw.startswith("```"):
            raw = raw.strip("`")
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw
            if raw.lower().startswith("json"):
                raw = raw[4:]
        data = json.loads(raw)
        return ReflectResponse(**data)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502, detail="The model didn't return valid JSON — try again."
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Reflection failed: {e}")
