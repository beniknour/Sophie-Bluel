import { displayWorks } from "./index.js";

/////////////Suppression d'un projet ///////////////////


let token = localStorage.getItem("token");

function deleteProject(projectId) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
    if (!confirmation) {
        return; // Annule la suppression si l'utilisateur clique sur "Annuler" 
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
        imageToDelete.remove();//supprime l'élément spécifique du DOM le retirant complètement de la page
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
 
  
///////afficher la deuxieme page du modal/////
function activerFormulaire() {
    const addButton = document.querySelector('.addImg');
    const form = document.getElementById('new-project-form');
    const hr = document.querySelector('.line');
    const p = document.querySelector('.galeriePhoto');
    const iconReturn = document.querySelector(".return");
    addButton.addEventListener('click', function() {
        iconReturn.style.display ='block';
        hr.style.display = 'none'; // Masquer le hr
        p.style.display = 'none'; // Masquer le Galerie photo
        addButton.style.display = 'none';  //Masque le Ajouter Photo
        form.style.display = 'block';
    });
  }
  
  activerFormulaire();


//ouverture et fermeture du modale /////////////////////////////////////
let modal = null;

const openModal = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
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
}

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
    
    
    images.forEach(image => {
        const container = document.createElement('div');
        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl; 
        imgElement.alt = image.title; 
        


        //affichage de la poubelle
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('far', 'fa-trash-alt'); 

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



function boutonRetour() {
    const retourButton = document.querySelector(".return");
    const modalGallery = document.querySelector(".modal-gallery");
    const newProjectForm = document.getElementById("new-project-form");
    const galeriePhoto = document.querySelector(".galeriePhoto");
    const addImageBtn = document.querySelector(".addImg");
    const hrLine = document.querySelector(".line");
    
    retourButton.addEventListener("click", () => {
        modalGallery.style.display = "grid";
        hrLine.style.display = "block";
        newProjectForm.style.display = "none";
        galeriePhoto.style.display = "block";
        addImageBtn.style.display = "block";
        retourButton.style.display ="none";

    });
}

 // Appel de la fonction pour gérer le clic sur le bouton "Retour"

boutonRetour();






// Fonction pour afficher le formulaire
function afficherFormulaire() {
    const newImage = document.getElementById('addImageForm');//formulaire
    newImage.style.display = 'block'; // Affiche le formulaire
}
// Button Ajouter 
addButton.addEventListener('click', () => {
    modalGallery.style.display = 'none'; // Cache la galerie d'images
    
    afficherBoutonRetour(); // Affiche le bouton "Retour"
    afficherFormulaire();

});

///////////////////////////AJOUT D'UN PROJET/////////////////////


  
document.getElementById("new-project-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const categories = {
        Objets: 1,
        Appartements: 2,
        'Hotels & restaurants': 3,
      };
    const title = document.getElementById("titleInput").value;
    const imageFile = document.getElementById("imageInput").files[0];
    const category = document.getElementById("categorySelect").value;
    const categoryID = categories[category];

    const errorMsg = document.getElementById("msgError");

    if (!title || !imageFile || !category) {
        errorMsg.textContent = "Veuillez remplir tous les champs du formulaire.";
        return;
    } else {
        errorMsg.textContent = ""; 
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageFile);
    formData.append("category", categoryID);
    formData.append("userId", 0);
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "application/json",
            },
            body: formData,
        });
  
        if (response.ok) {
            alert("Photo ajoutée avec succès !");
            const responseData = await response.json();
            if (image.size < 4 * 1048576) {
                // Création de la nouvelle carte image
                const newElement = document.createElement("figure");
                const newImage = document.createElement("img");
                newImage.src = responseData.imageUrl;
                const newTitle = document.createElement("figcaption");
                newTitle.innerText = title;
    
                newElement.appendChild(newImage);
                newElement.appendChild(newTitle);
    
                // Ajout de la nouvelle carte image à la galerie
                const gallery = document.querySelector("#gallery");
                gallery.prepend(newElement);
                
                // gallery.insertBefore(newElement, gallery.firstChild);
                // Efface le formulaire après l'ajout
                document.getElementById("new-project-form").reset();
            }
        } else {
            throw new Error("Erreur lors de l'ajout de la photo.");
        }
    } catch (error) {
        console.error("Erreur lors de la soumission du formulaire ", error);
        console.error("Réponse de l'API :", await response.json());
        alert("Une erreur s'est produite. Veuillez réessayer.");
    }
});

  
 ///Ajout d'une image sur le formulaire//


  const imageInput = document.getElementById('imageInput');
  const imageIcon = document.querySelector('.fa-regular.fa-image');
  const addImageText = document.querySelector('.add-image label');
  const imageFormatInfo = document.querySelector('.add-image p');

  imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Récupérer le fichier sélectionné
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        const imgSrc = e.target.result; // Récupérer l'URL de l'image
  
        // Créer un nouvel élément image
        const newImage = document.createElement('img');
        newImage.src = imgSrc;
        
        newImage.style.height = '190px';
        newImage.style.width = '130px';
  
        // Remplacer l'icône par l'image sélectionnée
        const addImageDiv = document.querySelector('.add-image');
        addImageDiv.replaceChild(newImage, imageIcon);
  
        // Cacher les éléments "Ajouter Photo" et le paragraphe
        addImageText.style.display = 'none';
        imageFormatInfo.style.display = 'none';
        imageInput.style.display ='none';
      };
  
      reader.readAsDataURL(file); // Lire le fichier en tant que Data URL
    }
  });


  
//CSS Bouton Valider///  
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-project-form');
    const titleInput = document.getElementById('titleInput');
    const imageInput = document.getElementById('imageInput');
    const categorySelect = document.getElementById('categorySelect');
    const submitButton = document.querySelector('.addImage');

    const toggleSubmitButton = () => {
        if (titleInput.value && imageInput.value && categorySelect.value) {
            submitButton.classList.add('active');
            submitButton.removeAttribute('disabled');
        } else {
            submitButton.classList.remove('active');
            submitButton.setAttribute('disabled', 'true');
        }
    };

    form.addEventListener('input', toggleSubmitButton);

    // Vérification initiale
    toggleSubmitButton();
});




