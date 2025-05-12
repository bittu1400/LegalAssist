from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.post("/chat")
def chat(user_message: str, token: str = Depends(oauth2_scheme)):
    # Verify token internally...
    return {"bot_reply": "Hello from LegalAssist!"}
