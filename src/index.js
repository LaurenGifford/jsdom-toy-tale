const toyCollection = document.querySelector('div#toy-collection')
const newToyForm = document.querySelector('.add-toy-form')
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const fetchURL = 'http://localhost:3000/toys'
// const sortDiv = document.querySelector('.sort')


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

window.addEventListener('load', makeDropdown)
newToyForm.addEventListener('submit', createToy)

toyCollection.addEventListener('submit', editToy)

toyCollection.addEventListener('click', handleClicks)

document.body.addEventListener('change', sortToys)



function sortToys(e){ 
  e.preventDefault()
  switch (true){
    case (e.target.value === "name"):
      console.log("name selected")
      fetchToys("name")
      break
    case (e.target.value === "likes"):
      console.log("likes selected")
      fetchToys("likes", "desc")
      break
  }
}

function handleClicks (e) {
  switch (true) {
    case (e.target.className === "like-btn"):
      increaseLikes(e)
      break
    case (e.target.className === "delete-btn"):
      deleteToy(e)
      break
    case (e.target.className === "edit-btn"):
      toggleEditForm(e)
      break
  }
}

function editToy(e) {
  e.preventDefault()
  const card = e.target.closest('.card')
  const id = card.dataset.id
  const toyName = card.querySelector('h2')
  const toyImage = card.querySelector('img')

  const name = e.target[0].value
  const image = e.target[1].value

  const editedToy = {name, image}
  console.log(editedToy)

  fetch(`${fetchURL}/${id}`, {
      method: "PATCH",
      headers : {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(editedToy)
  })
  .then(response => response.json())
  .then(data => {
      console.log(data)
    toyName.textContent = data.name
    toyImage.src = data.image
  })
  toggleEditForm(e)
}

function toggleEditForm(e) {
  const card = e.target.closest('.card')
  let editDiv = card.querySelector('.edit-form-div')
  const open = "rotateX(0deg)"
  const closed = "rotateX(90deg)"

  editDiv.style.transform = editDiv.style.transform !== open ? open : closed
}
 

function increaseLikes(e) {
  const card = e.target.closest('.card')
  const id = card.dataset.id
  const likesDisplay = card.querySelector('p')
  const likesCount = parseInt(likesDisplay.textContent)

  fetch(`${fetchURL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({"likes": likesCount + 1})
  })
  .then(response => response.json())
  .then(data => likesDisplay.textContent = `${data.likes} Likes`)
}

function deleteToy(e) {
  const card = e.target.closest('.card')
  const id = card.dataset.id

  fetch(`${fetchURL}/${id}`, { method: "DELETE" } )
  .then( card.remove() )
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


function fetchToys(sortOption, order = "asc"){
  fetch(`${fetchURL}?_sort=${sortOption}&_order=${order}`)
  .then(response => response.json())
  .then(toyData => {
    Array.from(toyCollection.children).forEach( child => child.remove() )
    toyData.forEach( toy => renderToy(toy) )
  })
}

function renderToy(toy){
    const toyDiv = document.createElement('div')
    toyDiv.className = "card"
    toyDiv.dataset.id = toy.id

    //////// EDIT FORM ///////////////
    const editFormDiv = document.createElement("div")
    editFormDiv.className = "edit-form-div"

    const editForm = document.createElement("form")
    editForm.className = "edit-form"

    const heading = document.createElement("h3")
    heading.textContent = "Edit This Toy!"

    const editName = document.createElement("input")
    editName.type = "text"
    editName.name = "name"
    editName.value = toy.name
    editName.classList.add('input-text', 'small')

    const editImage = document.createElement("input")
    editImage.type = "text"
    editImage.name = "image"
    editImage.value = toy.image
    editImage.classList.add('input-text', 'small')

    const editSubmit = document.createElement("input")
    editSubmit.type = "submit"
    editSubmit.name = "submit"
    editSubmit.value = "Save"

    editForm.append(heading, editName, editImage, editSubmit)
    editFormDiv.append(editForm)
    /////////////////////////////////////
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

    const editBtn = document.createElement('button')
    editBtn.textContent = "Edit"
    editBtn.className = "edit-btn"
    
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = "Delete 😢"
    deleteBtn.className = "delete-btn"

    const buttonDiv = document.createElement("div")
    buttonDiv.className = "button-div"
    
    buttonDiv.append(likeBtn, editBtn, deleteBtn)
    toyDiv.append(editFormDiv, toyName, toyImg, toyP, buttonDiv)
    toyCollection.append(toyDiv)
}


// Init

function makeDropdown(){
const sortDiv = document.createElement('div')
sortDiv.className = 'sort'
const dropdown = document.createElement('select')
dropdown.innerHTML = `
<option value="name" selected= "selected">Name</option>
<option value="likes">Likes</option>
`
sortDiv.append(dropdown)
document.body.insertBefore(sortDiv, toyCollection)
}

fetchToys("name")

