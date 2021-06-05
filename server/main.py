from fastapi import FastAPI
from router import router
import uvicorn


app = FastAPI()
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run('main:app', host='0.0.0.0', port=8050)
