// Define DOM 
const imageContainer = document.querySelector('.image-container')
const saveConfirmed = document.querySelector('.saveConfirmed')
const removeConfirmed = document.querySelector('.removeConfirmed')
const loader = document.querySelector('.loader')
const resultsNav = document.getElementById('resultsNav')
const favortiesNav = document.getElementById('favortiesNav')

// API Key 
const count = 10;
const apiKey = 'RHrrvSgJU9B41cd4WCAbK8RpOxJJtykLczPhDWaO'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;


// Show loader
function showContent(page) {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
  if (page === 'results') {
    resultsNav.classList.remove('hidden')
    favortiesNav.classList.add('hidden')
  } else {
    resultsNav.classList.add('hidden')
    favortiesNav.classList.remove('hidden')
  }
  loader.classList.add('hidden')
}

// Use forEach to loop through resultArray
let resultArray = []
let favorites = {}


function createDOMNodes(page) {
  // create currentArray and check if page equals to resultArray or favorites
  const currentArray = page === 'results' ? resultArray : Object.values(favorites)
  // console.log('currentArray', page, currentArray)
  // forEach method only works in an array, but favorites is an object 
  // Object.values return values from an object
  currentArray.forEach((result) => {
    // card
    const card = document.createElement('div')
    card.classList.add('card')
    const link = document.createElement('a')
    link.href = result.hdurl
    link.title = 'View Full Image'
    link.target = '_blank'
    // Image
    const image = document.createElement('img')
    image.src = result.url
    image.alt = 'No NASA Image for This Article'
    image.loading = 'lazy'
    image.classList.add('card-img-top')
    //cardBody
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    //cardTitle
    const cardTitle = document.createElement('h5')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = result.title
    //saveText
    const saveText = document.createElement('p')
    saveText.classList.add('clickable')
    if (page === 'results') {
      saveText.textContent = 'Add to Favorites'
      //setAttribute
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`)
    } else {
      saveText.textContent = 'Remove Favorites'
      //setAttribute
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`)
    }

    //cardText
    const cardText = document.createElement('p')
    cardText.classList.add('card-text')
    cardText.textContent = result.explanation
    //Footer
    const footer = document.createElement('small')
    const date = document.createElement('strong')
    date.textContent = result.date
    //copyright, defined undefined user to empty string
    const copyRightResult = result.copyright === undefined ? 'unknown author' : result.copyright
    const copyRight = document.createElement('span')
    copyRight.textContent = ` ${copyRightResult}`
    // append 
    footer.append(date, copyRight)
    cardBody.append(cardTitle, saveText, cardText, footer)
    link.appendChild(image)
    card.append(link, cardBody)
    // console.log(card)
    imageContainer.appendChild(card)
  })
}

function updateDOM(page) {
  // if statement: if there is a favorite item in favorites
  if (localStorage.getItem('favorites')) {
    favorites = JSON.parse(localStorage.getItem('favorites'))
    // console.log('favo from localstorage', favorites)
  }
  // reset the page 
  imageContainer.textContent = ''
  createDOMNodes(page)
  showContent(page)
}

async function getNasaData() {
  loader.classList.remove('hidden')
  try {
    const resp = await fetch(apiUrl)
    resultArray = await resp.json()
    // console.log(resultArray)
    console.log(resultArray)
    updateDOM('results')
  } catch (error) {
    console.log('Opps please fix the error')
  }
}

// Save to favorite 
function saveFavorite(itemsUrl) {
  resultArray.forEach((item) => {
    if (item.url.includes(itemsUrl) && !favorites[itemsUrl]) {
      // if favorite[itemsUrl] is already incluude, we don't run the following 
      favorites[itemsUrl] = item
      // Save Confirmation 
      saveConfirmed.hidden = false
      setTimeout(() => {
        saveConfirmed.hidden = true
      }, 2000)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  })
}

function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    removeConfirmed.hidden = false
    setTimeout(() => {
      removeConfirmed.hidden = true
    }, 2000)
    // Set Favorites in localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateDOM('favorites')
  }
}


//On Load 
getNasaData()