//Typing animation
const firstLine = document.querySelector('.typing-container');
const secondLine = document.querySelector('.second-typing-text');

const stateInteracted = document.querySelector('.state-Interacted');
const stateHaventInteracted = document.querySelector('.state-havent-interacted');

secondLine.style.borderRight = 'none';
firstLine.addEventListener('animationend',function(){
    firstLine.style.borderRight = 'none';
    secondLine.style.opacity = 1;
    secondLine.style.borderRight = '4px solid white';
    secondLine.classList.add("animate-typing");
});

const textarea = document.querySelector('textarea');
const textAreaChat = document.querySelector('.textAreaChat');

textarea.addEventListener('input', () => {
  textarea.style.height = 'auto'; // reset first
  textarea.style.height = textarea.scrollHeight + 'px';
});
if(textarea.textContent == ''){
    textarea.style.height = 'auto'
}


//Transition to UI chat 
const welcome = document.querySelector('.welcome-state');
const chat = document.querySelector('.chat-state');
const bodyTag = document.querySelector('.body');

//Some JS for chat stuff
const userResponseText = document.querySelector('.userResponseText');

textarea.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const value = textarea.value.trim();  //Captures the value here, now we should send this to the backend
    let dict_values = {"textAreaValue": value} //Put values inside a json format
      fetch("http://127.0.0.1:8000/main",{
      method: 'POST',
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(dict_values),
    })
    .then(response => response.json())
    .then(data_received => {
      console.log("Got response", data_received);

      // Display results
      data_received.forEach(movie => buildResponse(movie));
    });


    if (value === '') {
      return;
    }
    else{
        userResponseText.textContent = value;
 
    }
    welcome.classList.add('fadingToChatAnimation');

    welcome.addEventListener('animationend',()=>{
        welcome.classList.add('hide');
        chat.classList.remove('hide');
        bodyTag.classList.remove('bg-gradient-to-b', 'from-gray-800', 'to-black');
        bodyTag.classList.remove('overflow-hidden')
        bodyTag.classList.add('pr-20', 'pt-15', 'bg-gray-700');
        

    })
  }
});
const inputAndOutput = document.querySelector('.inputAndOutput');

textAreaChat.addEventListener('keypress',(e)=>{
    if (e.key === 'Enter') {
        e.preventDefault();
        const value = textAreaChat.value.trim();
        let dict_values = {"textAreaValue": value} //Put values inside a json format
        
        fetch("http://127.0.0.1:8000/main", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dict_values),
        })
        .then(response => response.json())
        .then(data_received => {
            console.log("Got response", data_received);

            data_received.forEach(movie => buildResponse(movie));
        });

        

        if (value === '') {
            return;
        }
        else{
            textAreaChat.value = ''; // clear after submit

            //Build the response 
            const userResponseContainerElem = document.createElement('div');
            userResponseContainerElem.className = 'userReponseContainer w-fit max-w-[600px] h-auto overflow-hidden resize-none h-auto ml-auto p-3 rounded-2xl bg-gray-600';
            const lineElem = document.createElement("div");
            lineElem.className = "line w-3/4 h-1 bg-gray-200 justify-self-center mt-20 opacity-20 rounded-2xl";

            const userReponseTextElem = document.createElement('p');
            userReponseTextElem.textContent = value;
            userReponseTextElem.className = 'userResponseText text-white';


            userResponseContainerElem.appendChild(userReponseTextElem);
            inputAndOutput.appendChild(userResponseContainerElem);
            inputAndOutput.appendChild(lineElem)


        }
    }
});

function buildResponse(currentMovie) {
  const wrapper = document.querySelector(".wrapper");

  const responseContainerElem = document.createElement("div");
  responseContainerElem.className =
    "bg-black/20 p-4 rounded-2xl shadow-md space-y-1 w-7/10 mt-5 justify-self-center animate-fade-in";

  // Flex container for image + text
  const flexContainer = document.createElement("div");
  flexContainer.className = "flex";

  // Image
  const imgElem = document.createElement("img");
  imgElem.className = "w-30 h-50 object-cover rounded mr-10";
  imgElem.src = currentMovie.Poster_Link || "https://via.placeholder.com/150";
  flexContainer.appendChild(imgElem);

  // Left Movie (textual details)
  const leftMovie = document.createElement("div");
  leftMovie.className = "leftMovie";

  // Title + Year
  const titleElem = document.createElement("h2");
  titleElem.className = "text-white font-bold";
  titleElem.innerHTML = `${currentMovie.Series_Title} <span class="text-gray-400">(${currentMovie.Released_Year})</span>`;
  leftMovie.appendChild(titleElem);

  // Rating + Votes + Certificate + Duration
  const infoRatingElem = document.createElement("div");
  infoRatingElem.className = "text-gray-300 text-sm";
  infoRatingElem.innerHTML =
    `⭐ <span class="text-yellow-400">${currentMovie.IMDB_Rating}</span> ` +
    `(${currentMovie.No_of_Votes}) · ${currentMovie.Certificate} · ${currentMovie.Runtime}`;
  leftMovie.appendChild(infoRatingElem);

  // Genre
  const infoGenreElem = document.createElement("div");
  infoGenreElem.className = "text-gray-400 text-sm";
  infoGenreElem.innerHTML =
    `<span class="font-semibold">Genre:</span> ${currentMovie.Genre}`;
  leftMovie.appendChild(infoGenreElem);

  // Stars
  const infoStarElem = document.createElement("div");
  infoStarElem.className = "text-gray-400 text-sm";
  infoStarElem.innerHTML =
    `<span class="font-semibold">Stars:</span> ${currentMovie.Star1}, ${currentMovie.Star2}, ${currentMovie.Star3}, ${currentMovie.Star4}`;
  leftMovie.appendChild(infoStarElem);

  // Description
  const descElem = document.createElement("p");
  descElem.className = "text-gray-400 text-sm";
  descElem.textContent = currentMovie.Overview;
  leftMovie.appendChild(descElem);

  // Append leftMovie to flex container
  flexContainer.appendChild(leftMovie);

  // Append flexContainer to main response container
  responseContainerElem.appendChild(flexContainer);

  // Append everything to wrapper
  wrapper.appendChild(responseContainerElem);
  inputAndOutput.appendChild(responseContainerElem)

  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });





}



