
from pyodide.http import open_url
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from js import document
from js import console

# Steps:
# 1. Take the user input from two inputs, textArea and textAreaChat
# 2. Put these user input's values into an embedding model
# 3. Get the output of this embedding model 
# 4. Take and organize the output of the embedding model
# 5. Display it as html

# Load your dataset
url = "https://github.com/JonasTheW/MoviAsk/raw/bd42004b938ba9f8fc68f64308f179815c80cfdb/IMBD.csv"
df = pd.read_csv(url, encoding="utf-8")
print("✅ PyScript loaded and running!")

#Take user inputs
userInputWelcome = document.querySelector('textArea')
userInputChat = document.querySelector('textAreaChat')


embeddings = "https://raw.githubusercontent.com/JonasTheW/MoviAsk/main/movie_embeddings.npy"
model = SentenceTransformer('all-MiniLM-L6-v2')

console.log(userInputWelcome, userInputChat)
def addInputToEmbedModel():
    #Got values here
    userChatValue = userInputChat.value.strip()
    userWelcomeValue = userInputWelcome.value.strip()
    

    #Put values into embed model and get the output of the membedding model
    if(userChatValue != ''):
        input_text = userChatValue
        console.log(input_text)

    elif(userWelcomeValue != ''):
        input_text = userWelcomeValue
        console.log(input_text)
    else:
        print("No input provided")
        return None
    embedded_input = model.encode(input_text)

    similarities = cosine_similarity(embedded_input, embeddings)
    top_indices = similarities.argsort()[-5:][::-1]
    print('Top Mathces: ')
    

#Display purposes
userReponseContainer = document.querySelector('')
userResponseText = document.querySelector('')


addInputToEmbedModel()




