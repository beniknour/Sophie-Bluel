
//LOGIN 


document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById("loginForm");
  if(form){

  
    // Écouteur d'événement pour le formulaire de connexion
    form.addEventListener("submit", function (e) {
      // Empêche l'envoi par défaut du formulaire par le navigateur
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
            // Redirection vers la page souhaitée et "true" pour les modifications du index.html
            localStorage.setItem("loggedIn", "true");
            location.href = "./index.html";
            document.getElementById('openModal').style.display = 'block';

          } else {
            error.innerText = " Erreur dans l’identifiant ou le mot de passe";
            // Efface le message d'erreur après un certain temps
            function msgdelete() {
              error.innerText = "";
            }
            setTimeout(msgdelete, 20000); //20 secondes
          }
        })
        .catch((err) => console.log(err)); // Affiche l'erreur dans la console en cas d'erreur de demande
    });
  }
});


/////LOGOUT////


document.addEventListener('DOMContentLoaded', (e) => {
  const loggedIn = localStorage.getItem("loggedIn");
  const loginButton = document.getElementById('login');

  if (loggedIn === "true" || loggedIn === true) {
    loginButton.textContent = 'logout';//Si true alors on voit logout
    loginButton.classList.add('loggedOF');
    loginButton.addEventListener('click', function(e){
        e.preventDefault();

        //Remove localstorage et loggedIn 
        localStorage.removeItem('token');
        localStorage.removeItem('loggedIn');

        // Redirection
        location.href = './index.html';
      });
  } else {
    loginButton.classList.add('loggedOn');//lorsqu'on voit le login
  }
});
