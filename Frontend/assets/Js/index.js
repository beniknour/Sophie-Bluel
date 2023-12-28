
//TRI par catégories grâce à works
const gallery = document.querySelector('.gallery');
const categoryButtons = document.querySelectorAll('.tri button');
let allWorks = []; // Stocke toutes les œuvres récupérées depuis l'API

// Fonction pour afficher les œuvres dans la galerie
function displayWorks(works) {
  gallery.innerHTML = ''; // Efface la galerie actuelle
  works.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

fetch('http://localhost:5678/api/works')// Lien de L'API
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Erreur lors de la récupération des projets');// Message d'erreur 
  })
  .then(works => {
    allWorks = works; // Stocke toutes les œuvres récupérées
    displayWorks(allWorks); // Affiche toutes les œuvres initialement
  })
  .catch(error => {
    console.error('Erreur :', error);
  });

// Buttons de catégories
categoryButtons.forEach(button => {
  button.addEventListener('click', function () {
    const selectedCategory = button.id.toLowerCase();
    let filteredWorks = [];// Création du tableau vide
    if (selectedCategory === 'tous') {
      filteredWorks = allWorks; // Affiche Tous
    } else {
      filteredWorks = allWorks.filter(work => {
        return work.category.name.toLowerCase().includes(selectedCategory.replace('hotelsrestaurants', 'hotels & restaurants'));
      });
    }
    displayWorks(filteredWorks); 
  });
});
export{displayWorks};


////////////////afficher les boutons seulement aprés user = true///////////////
function estConnecte() {
  // Récupère l'état de connexion depuis le localStorage
  const loggedIn = localStorage.getItem("loggedIn");
  return loggedIn === "true"; 
}

function gererVisibiliteElement() {
  if (estConnecte()) {
    document.getElementById('openModal').style.display = 'block';
  } else {
    document.getElementById('openModal').style.display = 'none';
  }
}

  gererVisibiliteElement();
//Masque les boutons de tri
window.addEventListener('DOMContentLoaded', (event) => {
  const loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn === "true") {
      const triButtons = document.querySelector('#portfolio .tri');
      if (triButtons) {
          triButtons.style.display = 'none';
      }
      localStorage.removeItem("loggedIn");
  }
}); 











