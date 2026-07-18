// משיכת אלמנטים מתוך מסמך ה-HTML
var form = document.getElementById("loginForm");
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var errorMessage = document.getElementById("errorMessage");

// הוספת מאזין לאירוע שליחת הטופס
form.addEventListener("submit", function (event) {
  // עצירת הפעולה הדיפולטיבית של הטופס (מניעת רענון העמוד)
  event.preventDefault(); 

  // ארגון נתוני ההתחברות לתוך אובייקט
  var loginData = {
    username: usernameInput.value,
    password: passwordInput.value
  };

  // שליחת הנתונים לשרת לצורך אימות
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(function(response) {
    // בדיקה האם השרת אישר את פרטי ההתחברות
    if (response.ok) {
      // מעבר לעמוד הנתונים במקרה של הצלחה
      window.location.href = "../DATA/dataPage.html"; 
    } else {
      // הצגת הודעת שגיאה מתאימה למשתמש במקרה של כישלון
      errorMessage.textContent = "Wrong username or password! Please try again.";
      errorMessage.style.display = "block";
    }
  })
  .catch(function(error) {
    // הדפסת שגיאת רשת לקונסול במידה וישנה תקלה בתקשורת
    console.log("Error during login:", error);
  });
});