
//TRI par catégories grâce à works
const gallery = document.querySelector('.gallery');
const categoryButtons = document.querySelectorAll('.tri button');
let allWorks = []; // Stocke toutes les œuvres récupérées depuis l'API
const loggedIn = localStorage.getItem("loggedIn");

// Fonction pour afficher les œuvres dans la galerie
function displayWorks(works) {
  gallery.innerHTML = ''; // Efface la galerie actuelle
  works.forEach(work => {
    // Création des balises
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


// Si user est false, alors exécuter le code
if (!loggedIn) {
  fetch('http://localhost:5678/api/works') // Lien de L'API
    .then(response => {
      if (response.ok) {
        return response.json(); // Renvoie des données sous format JSON
      }
      throw new Error('Erreur lors de la récupération des projets'); // Message d'erreur 
    })
    .then(works => {
      allWorks = works; // Stocke toutes les œuvres récupérées
      displayWorks(allWorks); // Affiche toutes les œuvres initialement
    })
    .catch(error => {
      console.error('Erreur :', error);
    });
}

// Buttons de catégories
categoryButtons.forEach(button => {
  button.addEventListener('click', function () {
    const selectedCategory = button.id.toLowerCase();//Récupere les Convertit en minuscule
    let filteredWorks = [];// Création du tableau vide
    if (selectedCategory === 'tous') {
      filteredWorks = allWorks; // Affiche Tous
    } else {
      //Filtration des oeuvres selon les catégories
      filteredWorks = allWorks.filter(work => {
        // Vérifie si le nom de la catégorie inclut la catégorie sélectionnée
        return work.category.name.toLowerCase().includes(selectedCategory.replace('hotelsrestaurants', 'hotels & restaurants'));
      });
    }
    displayWorks(filteredWorks); // Affiche les œuvres filtrées
  });
});



////////////////afficher les boutons seulement aprés user = true///////////////


function estConnecte() {
  // Récupère l'état de connexion depuis le localStorage
  const loggedIn = localStorage.getItem("loggedIn");
  return loggedIn === "true"; 
}
// Masque openodal
function gererVisibiliteElement() {
  if (estConnecte()) {
    document.getElementById('openModal').style.display = 'block';
  } else {
    document.getElementById('openModal').style.display = 'none';
  }
}

gererVisibiliteElement();


// Masque les boutons de tri

document.addEventListener('DOMContentLoaded', () => {
  const loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn === "true") {
      const triButtons = document.querySelector('#portfolio .tri');
      if (triButtons) {
          triButtons.style.display = 'none';
      }
  }
  console.log('tri');
}); 

// Mode édition 

document.addEventListener('DOMContentLoaded', () => {
  if (loggedIn) {
    const editDiv = document.createElement('div');
    editDiv.classList.add('edition'); // Ajout de la classe 

    // Création de l'icône
    const editIcon = document.createElement('i');
    editIcon.classList.add('fa-regular', 'fa-pen-to-square');
    editDiv.appendChild(editIcon); // Ajout de l'icône à la balise div

    // Ajout du paragraphe contenant le texte
    const editP= document.createElement('p');
    editP.textContent = 'Mode édition';
    editDiv.appendChild(editP); // Ajout du paragraphe à la balise div

    // Insertion de l'élément en firstChild
    document.body.insertBefore(editDiv, document.body.firstChild);
}
});