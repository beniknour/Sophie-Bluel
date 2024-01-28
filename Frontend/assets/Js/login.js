
//****LOGIN//****

function loginUser() {
  const form = document.getElementById("loginForm");
  const error = document.getElementById("error");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const information = new FormData(form);
      const payload = new URLSearchParams(information);
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
          if (data.userId == 1) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("loggedIn", "true");
            location.href = "./index.html";
          } else {
            error.innerText =
              "Erreur dans l’identifiant ou le mot de passe";
            function msgdelete() {
              error.innerText = "";
            }
            setTimeout(msgdelete, 20000);
          }
        })
        .catch((err) => console.log(err));
    });
  }
}



//****LOGOUT ****//

function logoutUser() {
  const loggedIn = localStorage.getItem("loggedIn");
  const loginButton = document.getElementById("login");

  if (loggedIn === "true" || loggedIn === true) {
    loginButton.textContent = "logout";
    loginButton.classList.add("loggedOF");
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("loggedIn");
      location.href = "./index.html";
    });
  } else {
    loginButton.classList.add("loggedOn");
  }
}

// Appeler les fonctions directement sans attendre le chargement du DOM
loginUser();
logoutUser();

