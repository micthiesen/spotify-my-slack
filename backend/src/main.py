from fastapi import FastAPI

APP = FastAPI()


@APP.get("/")
def read_root():
    return {"Hello": "World"}


@APP.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
