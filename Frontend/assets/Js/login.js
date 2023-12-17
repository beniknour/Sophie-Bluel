
//LOGIN 


// Référence aux éléments HTML pour les identifiants d'email et de mot de passe
const email = document.getElementById("email");
const password = document.getElementById("password");
// erreurs
const error = document.getElementById("error");
// formulaire
const valid = document.getElementById("loginSubmit");
// formulaire de connexion
const form = document.getElementById("loginForm");

// Écouteur d'événement pour le formulaire de connexion
  form.addEventListener("submit", function (e) {
  // Empêche l'envoi par défaut du formulaire par le navigateur, l'envoi est géré par notre code JavaScript
  e.preventDefault();

  // Récupère les entrées de formulaire
  const information = new FormData(form);
  const payload = new URLSearchParams(information);

  // Fait une demande POST au serveur pour vérifier les informations de connexion
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: payload,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // Si l'id est vrai alors true
      if (data.userId == 1) {
        // Stockage dans le localStorage
        localStorage.setItem("token", data.token);
        // Redirection vers la page souhaité et "true" pour les modifications du index.html
        localStorage.setItem("loggedIn", "true");
        location.href = "./index.html";


      } else {
        error.innerText = " Erreur dans l’identifiant ou le mot de passe";
        // Efface le message d'erreur après un certain temps
        function msgdelete() {
          error.innerText = "";
        }
        setTimeout(msgdelete, 40000); //40 secondes
      }
    })
    .catch((err) => console.log(err)); // Affiche l'erreur dans la console en cas d'erreur de demande
});


