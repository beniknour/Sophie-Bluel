let token = localStorage.getItem("token");


//******************** SUPRESSION d'un projet ********************//

//AFFICHAGE IMAGES SUR LE MODAL//

async function displayImagesInModal(images) {
    const modalGallery = document.getElementById('model_gallery');
    modalGallery.innerHTML='';
    images.forEach(image => {
        const container = document.createElement('div');
        container.setAttribute('data-image-id', image.id)
        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl; 
        imgElement.alt = image.title; 

        //Affichage de la poubelle
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('far', 'fa-trash-alt'); 

        container.appendChild(imgElement);
        container.appendChild(deleteIcon);
        modalGallery.appendChild(container);

        deleteIcon.addEventListener('click', event => {
            event.preventDefault();
            deleteProject(image.id);
        });

    });

}


function deleteProject(projectId) {
    // const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
    // if (!confirmation) {
    //     return false;
    // }

    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*'
        }
    })
    .then(response => {
        if (response.ok) {
            alert(`Le projet avec l'ID ${projectId} a été supprimé avec succès.`);
            const imageToDelete = document.querySelector(`[data-image-id="${projectId}"]`);
            if (imageToDelete) {
                imageToDelete.remove(); 
                updateHomePage();
            }
        }
         else {
            console.log(`Échec de la suppression du projet avec l'ID ${projectId}.`);
        }
    })
    .catch(error => {
        console.error(`Erreur lors de la suppression du projet avec l'ID ${projectId} :`, error);
    });

    return false;
}
//********* AFFICHE IMAGE SUR MODAL ET SUR LA PAGE D'ACCEUIL *********//

function fetchAndDisplayImages() {

    fetch('http://localhost:5678/api/works', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {return response.json();
    })
    .then(works => {
        console.log('Works from API:', works);
        homepage(works);//image page d'acceuil
        displayImagesInModal(works);//image modal
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}

fetchAndDisplayImages();

// AFICHE IMAGE SUR PAGE D'ACCEUIL //

function homepage(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Efface la galerie actuelle

    if (works) {
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
    } else {
        console.error("La variable 'works' n'est pas définie ou est incorrecte.");
    }
}

// Mettre à jour la page d'accueil //
function updateHomePage() {
    fetch('http://localhost:5678/api/works', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(works => {
        console.log('Works from API:', works);
        homepage(works);
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
}


//************************** PAGE MODAL 2 **************************//

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


///Montrer une image sur le formulaire visuellement//

function displaySelectedImage(event) {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgSrc = e.target.result;//Recupération de l'URL
            //Creation du nouvel élément
            const newImage = document.createElement('img');
            newImage.classList.add('newimg');
            newImage.src = imgSrc;//La source de l'image

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
  
//********* AJOUT D'UN PROJET *********//
document.getElementById("new-project-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut

    const categories = {
        Objets: 1,
        Appartements: 2,
        'Hotels & restaurants': 3,
    };
    const submitButton = document.querySelector('.addImage');
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
                accept: "*/*",
            },
            body: formData,
        });

        if (response.ok) {
            alert("Photo ajoutée avec succès !");
            const responseData = await response.json();
            if (imageFile.size < 4 * 1048576) {
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
                resetSelectedImage();
                submitButton.classList.remove('active');
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
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-project-form');
    const titleInput = document.getElementById('titleInput');
    const imageInput = document.getElementById('imageInput');
    const categorySelect = document.getElementById('categorySelect');
    const submitButton = document.querySelector('.addImage');
    const errorMsg = document.getElementById("msgError");

    //changement de la couleur du bouton

    const toggleSubmitButton = () => {
        if (titleInput.value && imageInput.value && categorySelect.value) {
            submitButton.classList.add('active');
        } else {
            submitButton.classList.remove('active');
        }
    };

    form.addEventListener('input', toggleSubmitButton);
    toggleSubmitButton();

    //message d'erreur

    submitButton.addEventListener('click', () => { 
        const isValid = titleInput.value && imageInput.value && categorySelect.value;

        if (!isValid) {
            errorMsg.textContent = "Veuillez remplir tous les champs du formulaire.";
            setTimeout(() => {
                errorMsg.textContent = "";
            }, 1000);
        } else {
            errorMsg.textContent = "";
        }

       
    });

});

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

//BOUTON RETOUR DE LA MODAL//

function boutonRetour() {
    const submitButton = document.querySelector('.addImage');
    const formulaire = document.getElementById('new-project-form');
    const retourButton = document.querySelector(".return");
    const modalGallery = document.querySelector(".modal-gallery");
    const newProjectForm = document.getElementById("new-project-form");
    const galeriePhoto = document.querySelector(".galeriePhoto");
    const addImageBtn = document.querySelector(".addImg");
    const hrLine = document.querySelector(".line");
    const addImageDiv = document.querySelector('.add-image img');
    const errorMsg = document.getElementById('msgError');
    retourButton.addEventListener("click", (e) => {
        e.preventDefault();
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
        //Reset bouton
        submitButton.classList.remove('active');
    });
    console.log('retour');
}

boutonRetour();

//*****Ouverture du modale*****//
let modal = null;

const openModal = function(e) {


    document.getElementById('openModal').style.display = 'block';
    // const modal = document.querySelector(e.target.getAttribute('href'));
    modal = document.querySelector(".modal");
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    //close modal
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModalOutside);

};
    
document.querySelector('.js-modal').addEventListener('click', openModal);
    
//*****Fermeture du modale*****//

const closeModal = function(e) {
    e.preventDefault();
    const formulaire = document.getElementById('new-project-form');
    const errorMsg = document.getElementById('msgError');
    const submitButton = document.querySelector('.addImage');
    if (modal === null) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);

    modal = null;
    formulaire.reset();//Reset le Formulaire 
    //Appel à la fonction pour reset l'ajout d'image
    resetSelectedImage();
    //Reset msg d'erreur
    errorMsg.textContent = '';
    //Reset bouton
    submitButton.classList.remove('active');


}

const closeModalOutside = function(e) {
    const formulaire = document.getElementById('new-project-form');
    const errorMsg = document.getElementById('msgError');
    const submitButton = document.querySelector('.addImage');
    if (modal !== null && e.target === modal) {
        closeModal(e);
        formulaire.reset(); // Reset le Formulaire 
        // Appel à la fonction pour reset l'ajout d'image
        resetSelectedImage();
        // Reset msg d'erreur
        errorMsg.textContent = '';
        //Reset bouton
        submitButton.classList.remove('active');
    }
};

document.addEventListener('click', closeModalOutside);



