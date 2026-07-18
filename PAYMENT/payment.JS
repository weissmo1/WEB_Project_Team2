// משיכת נתוני העגלה מזיכרון הדפדפן
var incomingCartData = JSON.parse(localStorage.getItem("cart")) || [];

// חישוב והצגת המחיר הכולל של הפריטים בעגלה
function updateTotalPrice() {
    var total = 0;
    incomingCartData.forEach((shirt) => {
        var qty = parseInt(shirt.quantity) || 1;
        total += qty * 40;
    });

    var display = document.getElementById("total-price-display");
    if (display) display.textContent = total + "$";
    
    // שמירת המחיר הסופי לצורך הצגה בעמוד הבא
    sessionStorage.setItem("finalPrice", total);
}

// יצירת תצוגת הפריטים שבעגלה והצגתם בעמוד
function renderCart() {
    var cartContainer = document.getElementById("cart-items-list");
    if (!cartContainer) return;
    
    cartContainer.innerHTML = "";

    incomingCartData.forEach((shirt, index) => {
        var shirtHTML = `
            <div class="cart-item">
                <div class="item-details">
                    <h3 class="font">${shirt.shirtId}</h3>
                    <p class="font">Size: ${shirt.size}</p>
                    <p class="font">Quantity: ${shirt.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeProduct(${index})">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16" style="width: 20px; height: 20px;">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                    </svg>
                </button>
            </div>
        `;
        cartContainer.innerHTML += shirtHTML;
    });
    
    updateTotalPrice();
}

// מחיקת פריט מהעגלה ורענון התצוגה והזיכרון
function removeProduct(index) {
    var isSure = confirm("Are you sure you want to remove the shirt from your shopping cart?");
    if (isSure) {
        incomingCartData.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(incomingCartData));
        renderCart();
    }
}

// הפעלת פונקציות האתחול והוולידציות בעת טעינת העמוד
window.onload = function() {
    renderCart();

    var form = document.querySelector(".order-form");
    if (form) {
        var nameInput = document.getElementById("full-name");
        if (nameInput) nameInput.name = "fullName";
        
        var stageInput = document.getElementById("course-stage");
        if (stageInput) stageInput.name = "stage";
        
        var phoneInput = document.getElementById("phone");
        if (phoneInput) phoneInput.name = "phone";

        form.action = "/api/checkout"; 
        form.method = "POST";

        // וולידציות לפני שליחת הטופס לשרת
        form.addEventListener("submit", function (event) {
            if (incomingCartData.length === 0) {
                event.preventDefault();
                alert("Your cart is empty!");
                return;
            }

            // בדיקה שהשם מכיל אותיות באנגלית ורווחים בלבד
            if (nameInput) {
                var nameRegex = /^[A-Za-z\s]+$/;
                if (!nameRegex.test(nameInput.value.trim())) {
                    event.preventDefault();
                    alert("Please enter a valid name using only English letters.");
                    nameInput.focus();
                    return;
                }
            }

            // בדיקה שהטלפון מכיל 10 ספרות בדיוק ומתחיל ב05
            if (phoneInput) {
                var cleanPhone = phoneInput.value.trim().replace(/[-\s]/g, "");
                var phoneRegex = /^05\d{8}$/;

                if (!phoneRegex.test(cleanPhone)) {
                    event.preventDefault();
                    alert("Please enter a valid 10-digit phone number starting with 05.");
                    phoneInput.focus();
                    return;
                }
                
                phoneInput.value = cleanPhone;
            }

            // יצירת שדה נסתר להעברת נתוני העגלה בשליחת הטופס
            var hiddenInput = document.getElementById("hiddenCartData");
            if (!hiddenInput) {
                hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = "cartData";
                hiddenInput.id = "hiddenCartData";
                form.appendChild(hiddenInput);
            }
            
            hiddenInput.value = JSON.stringify(incomingCartData);
        });
    }
};