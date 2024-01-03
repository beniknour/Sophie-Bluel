// import { displayWorks } from "./index.js";

/////////////Suppression d'un projet ///////////////////


let token = localStorage.getItem("token");

function deleteProject(projectId) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
    if (!confirmation) {
        return false; // Annule la suppression si l'utilisateur clique sur "Annuler" 
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


///////////////////Affichage des images sur le modale 1//////////////////////////

document.addEventListener("DOMContentLoaded", function () {
   

    fetch('http://localhost:5678/api/works', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Erreur lors de la récupération des projets');
    })
    .then(works => {
        const allWorks = works; // Stocke toutes les œuvres récupérées
        displayImagesInModal(allWorks); // Affiche toutes les œuvres dans le modal
    })
    .catch(error => {
        console.error('Erreur :', error);
        // Gérer les erreurs liées à la récupération des projets (peut-être une déconnexion)
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

}
//////////////////modal 2/////////////////////////////

///////Afficher la deuxieme page du modal/////
function activerFormulaire() {
    const addButton = document.querySelector('.addImg');
    const form = document.getElementById('new-project-form');
    const hr = document.querySelector('.line');
    const p = document.querySelector('.galeriePhoto');
    const iconReturn = document.querySelector(".return");
    addButton.addEventListener('click', function() {
        iconReturn.style.display ='block';//return
        hr.style.display = 'none'; //hr
        p.style.display = 'none'; // Galerie photo
        addButton.style.display = 'none';  //Ajout photo
        form.style.display = 'block';
    });
}
  
  activerFormulaire();

const addButton = document.querySelector('.addImg'); // Bouton Ajout
const modalGallery = document.getElementById('model_gallery'); // La galerie d'images



// Fonction pour afficher le formulaire
function afficherFormulaire() {
    const newImage = document.getElementById('new-project-form');//formulaire
    newImage.style.display = 'block'; // Affiche le formulaire
}


// Button Ajouter 
addButton.addEventListener('click', () => {
    modalGallery.style.display = 'none'; // Cache la galerie d'images
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
                const gallery = document.querySelector(".gallery");
                gallery.appendChild(newElement);

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
    return false;
});

  
///Montrer une image sur le formulaire//

//Input
const imageInput = document.getElementById('imageInput');
//Icon
const imageIcon = document.querySelector('.fa-regular.fa-image');
//Ajout Photo
const addImageText = document.querySelector('.add-image label');
//"jpg 4mo"
const imageFormatInfo = document.querySelector('.add-image p');
//Image
const displayedImage = document.querySelector('.add-image img');

//AFFICHAGE 

function displaySelectedImage(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgSrc = e.target.result;//Recupération de l'URL
            //Creation du nouvel élément
            const newImage = document.createElement('img');
            newImage.src = imgSrc;//La source de l'image
            newImage.style.height = '190px';
            newImage.style.width = '130px';

            const addImageDiv = document.querySelector('.add-image');
            addImageDiv.replaceChild(newImage, imageIcon);

            // Cache les autres éléments
            addImageText.style.display = 'none';
            imageFormatInfo.style.display = 'none';
            imageInput.style.display = 'none';
        };

        reader.readAsDataURL(file); // Lecture du fichier en tant que Data URL
    }
}

imageInput.addEventListener('change', displaySelectedImage);


// RESET Image 
function resetSelectedImage() {
    //On replace l'icon par l'image 
    const addImageDiv = document.querySelector('.add-image');
    addImageDiv.replaceChild(imageIcon, addImageDiv.firstChild);

    // Réinitialisation des elements masquées 
    addImageText.style.display = 'block';
    imageFormatInfo.style.display = 'block';
    imageInput.style.display = 'block';
    const addedImage = document.querySelector('.add-image img');
    // Supprime l'image ajoutée SI elle existe
    if (addedImage) {
        addedImage.remove();
    }
}

//CSS Bouton Valider///  
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-project-form');
    const titleInput = document.getElementById('titleInput');
    const imageInput = document.getElementById('imageInput');
    const categorySelect = document.getElementById('categorySelect');
    const submitButton = document.querySelector('.addImage');
    const errorMsg = document.getElementById("msgError");
    const toggleSubmitButton = () => {  
        if (titleInput.value && imageInput.value && categorySelect.value) {
            submitButton.classList.add('active');
            // submitButton.removeAttribute('disabled'); 
        } else {
            submitButton.classList.remove('active');
            //desactiver le bouton
            // submitButton.setAttribute('disabled', 'true');
           
        }

        
    };
    form.addEventListener('input', toggleSubmitButton);
    toggleSubmitButton();
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!titleInput.value || !imageInput.value || !categorySelect.value) {
            errorMsg.textContent = "Veuillez remplir tous les champs du formulaire.";
            setTimeout(1000);
        } else {
            errorMsg.textContent = ""; 
            
        }
    });
    
})






function boutonRetour() {
    const formulaire = document.getElementById('new-project-form');
    const retourButton = document.querySelector(".return");
    const modalGallery = document.querySelector(".modal-gallery");
    const newProjectForm = document.getElementById("new-project-form");
    const galeriePhoto = document.querySelector(".galeriePhoto");
    const addImageBtn = document.querySelector(".addImg");
    const hrLine = document.querySelector(".line");
    const addImageDiv = document.querySelector('.add-image img');
    const errorMsg = document.getElementById('msgError');
    retourButton.addEventListener("click", () => {
        addImageDiv.innerHTML = '';
        modalGallery.style.display = "grid";
        hrLine.style.display = "block";
        newProjectForm.style.display = "none";
        galeriePhoto.style.display = "block";
        addImageBtn.style.display = "block";
        retourButton.style.display ="none";
        //Reset formulaire
        formulaire.reset();
        //Appel à la fonction pour reset l'ajout d'image
        resetSelectedImage();
        //Reset msg d'erreur
        errorMsg.textContent = '';
    });
}

boutonRetour();

//ouverture et fermeture du modale /////
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
    const formulaire = document.getElementById('new-project-form');
    const errorMsg = document.getElementById('msgError');
    if (modal === null) return;
    e.preventDefault();
    e.stopPropagation();
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    window.removeEventListener('click', closeModalOutside);
    modal = null;
    formulaire.reset();//Reset le Formulaire 
    //Appel à la fonction pour reset l'ajout d'image
    resetSelectedImage();
    //Reset msg d'erreur
    errorMsg.textContent = '';
}

const closeModalOutside = function(e) {
    const formulaire = document.getElementById('new-project-form');
    const errorMsg = document.getElementById('msgError');
    if (e.target === modal) {
        closeModal(e);
        formulaire.reset();//Reset le Formulaire 
        //Appel à la fonction pour reset l'ajout d'image
        resetSelectedImage();
        //Reset msg d'erreur
        errorMsg.textContent = '';
    }
};