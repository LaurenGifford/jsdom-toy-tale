const toyCollection = document.querySelector('div#toy-collection')
const newToyForm = document.querySelector('.add-toy-form')
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const fetchURL = 'http://localhost:3000/toys'



let addToy = false;

addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
});

newToyForm.addEventListener('submit', createToy)

toyCollection.addEventListener('click', increaseLikes)

function increaseLikes(e) {
  if (e.target.className === "like-btn" ){
    const card = e.target.closest('.card')
    const likesDisplay = card.querySelector('p')
    const id = card.dataset.id
    const likesCount = parseInt(e.target.previousElementSibling.textContent)

    fetch(`${fetchURL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({"likes": likesCount + 1})
    })
    .then(response => response.json())
    .then(data => likesDisplay.innerText = `${data.likes} Likes`)
  }
}


function createToy(e) {
  e.preventDefault()
  console.log(e.target[0].value)

  const name = e.target[0].value
  const image = e.target[1].value
  const likes = 0

  const newToy = {name, image, likes}
  console.log(newToy)

  fetch(fetchURL, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(data => renderToy(data))

  e.target.reset()
}




function fetchToys(){
  fetch(fetchURL)
  .then(response => response.json())
  .then(toyData => toyData.forEach(toy => renderToy(toy)))
}

function renderToy(toy){
    const toyDiv = document.createElement('div')
    toyDiv.className = "card"
    toyDiv.dataset.id = toy.id

    const toyName = document.createElement('h2')
    toyName.textContent = `${toy.name}`

    const toyImg = document.createElement('img')
    toyImg.src = `${toy.image}`
    toyImg.className = 'toy-avatar'

    const toyP = document.createElement('p')
    toyP.textContent = `${toy.likes} Likes`

    const likeBtn = document.createElement('button')
    likeBtn.textContent = "Like <3"
    likeBtn.className = "like-btn"

    toyDiv.append(toyName, toyImg, toyP, likeBtn)
    toyCollection.append(toyDiv)
}


fetchToys()