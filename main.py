from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import re, unicodedata
import ast
model = SentenceTransformer('all-MiniLM-L6-v2')

csv_url = "https://raw.githubusercontent.com/JonasTheW/MoviAsk/refs/heads/main/imdb_top_1000.csv"
# Read and clean
df = pd.read_csv(csv_url, encoding="utf-8", on_bad_lines='skip').fillna('')

print("df shape:", df.shape)


app = FastAPI()


app.add_middleware( #Needed for CORS
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dataset = np.load("movieEmbeddings.npy")
last_top_movies = None
print("dataset shape:", dataset.shape)
def index_to_movie(top_indices):
    #As top indices is an array with 5 elements
    return df.iloc[top_indices]

def embedding_model(user_input: str):
    embedded_input = model.encode(user_input)
    return embedded_input

def compute_similarity(embedded_input, dataset):
    similarities = cosine_similarity([embedded_input], dataset)
    top_indices = similarities.argsort()[0][-5:][::-1]
    return top_indices

@app.post("/main")
async def get_data_from_front(request: Request): #this request object contains all of the things sent from the front-end 
    global last_top_movies
    data = await request.json() 
    print(f"Data received: {data}") #Confirmed

    text_value = data.get("textAreaValue")
    
    if not text_value:
        return{"error":"No input provided"}

    embedded_input = embedding_model(text_value)

    top_indices = compute_similarity(embedded_input, dataset)
    top_movies = index_to_movie(top_indices.tolist())

    last_top_movies = top_movies #Update the global variable
    print(top_indices.tolist())
    print(top_movies)

    return top_movies.to_dict(orient="records")



