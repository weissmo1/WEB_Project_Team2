var form = document.getElementById("loginForm");
var passwordInput = document.getElementById("password");
var errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", function (event) {
  if (passwordInput.value !== "1234") {
    event.preventDefault();
    errorMessage.textContent = "Wrong password! Please try again.";
    errorMessage.style.display = "block";
  }
});
