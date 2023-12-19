import { displayWorks } from "./index.js";

/////////////Suppression d'un projet ///////////////////


let token = localStorage.getItem("token");

function deleteProject(projectId) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
    if (!confirmation) {
        return; // Annuler la suppression si l'utilisateur clique sur "Annuler" dans la boîte de dialogue
    }
    fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': '*/*'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log(`Le projet avec l'ID ${projectId} a été supprimé avec succès.`);
        // Mettre à jour l'interface utilisateur ou effectuer d'autres actions après la suppression
        const imageToDelete = document.querySelector(`[data-image-id="${projectId}"]`);
        if (imageToDelete) {
        imageToDelete.remove();
      }
      }
       else {
        console.log(`Échec de la suppression du projet avec l'ID ${projectId}.`);
      }
    })
    .catch(error => {
      console.error(`Erreur lors de la suppression du projet avec l'ID ${projectId} :`, error);
    });
}
  

//ouverture et fermeture du modale /////////////////////////////////////
let modal = null;

const openModal = function(e) {
    e.preventDefault();
    
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    window.addEventListener('click', closeModalOutside);
};
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});

const closeModal = function(e) {
    if (modal === null) return;
    e.preventDefault();
    
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    window.removeEventListener('click', closeModalOutside);
    modal = null;
};

const closeModalOutside = function(e) {
    if (e.target === modal) {
        closeModal(e);
    }
};

///////////////////affichage des images sur le modale//////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erreur lors de la récupération des projets');
        })
        .then(works => {
            const allWorks = works; // Stocke toutes les œuvres récupérées
            displayImagesInModal(allWorks); // Affiche toutes les œuvres dans le modale
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
});

function displayImagesInModal(images) {
    const modalGallery = document.getElementById('model_gallery');
    // const newImage = document.getElementById('addImageForm');//formulaire
    // newImage.style.display = 'none';//ne pas montrer le formulaire
    images.forEach(image => {
        const container = document.createElement('div');
        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl; 
        imgElement.alt = image.title; 
        


        //affichage de la poubelle
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('far', 'fa-trash-alt'); // Ajoute une classe pour le style
       


        container.appendChild(imgElement);
        container.appendChild(deleteIcon);
        modalGallery.appendChild(container);

        deleteIcon.addEventListener('click', () => deleteProject(image.id));
    });

    // Afficher le modal après avoir ajouté les images
    // const modal = document.getElementById('modal');
    // modal.style.display = 'block';
    // modal.removeAttribute('aria-hidden');
}
//////////////////new modal/////////////////////////////


const addButton = document.querySelector('.addImg'); // Sélectionnez le bouton "Add"
const modalGallery = document.getElementById('model_gallery'); // Sélectionnez la galerie d'images
const modalWrapper = document.querySelector('.modal-wrapper');


// Fonction pour afficher le bouton "Retour"
function afficherBoutonRetour() {
    const backButton = document.createElement('button'); // Créez un bouton
    backButton.textContent = 'Retour'; // Texte du bouton
    backButton.className = 'retourButton'; // Classe CSS pour le bouton
    backButton.addEventListener('click', () => {
        modalGallery.style.display = 'block'; // Affiche à nouveau la galerie d'images
        backButton.remove(); // Retire le bouton "Retour" une fois cliqué
    });

    modalWrapper.appendChild(backButton); // Ajoute le bouton dans le wrapper modal
}

// Fonction pour afficher le formulaire
function afficherFormulaire() {
    
    newImage.style.display = 'block'; // Affiche le formulaire
}
// Ajoutez un écouteur d'événements au bouton "Add"
addButton.addEventListener('click', () => {
    modalGallery.style.display = 'none'; // Cache la galerie d'images
    
    afficherBoutonRetour(); // Affiche le bouton "Retour"
    afficherFormulaire();

});