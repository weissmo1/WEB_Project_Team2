function addToCart(event) {
  // מניעת רענון העמוד בעת לחיצה על כפתור השליחה
  event.preventDefault();
  
  var clickedButton = event.target;
  var shirtContainer = clickedButton.closest(".shirt_div");
  
  // שליפת פרטי החולצה מתוך מבנה העמוד
  var shirtName = shirtContainer.querySelector(".name h3").textContent.trim();
  var shirtSize = shirtContainer.querySelector('select[name="size"]').value;
  var shirtQuantity = parseInt(shirtContainer.querySelector('select[name="quantity"]').value) || 1;

  // שליפת נתוני המלאי מהשרת לבדיקה לפני הוספה לעגלה
  fetch('/inventory')
    .then(function(response) {
      return response.json();
    })
    .then(function(inventoryData) {
      var shirtInDb = null;

      // איתור החולצה המבוקשת במערך הנתונים שהתקבל מהשרת
      for (var i = 0; i < inventoryData.length; i++) {
        if (inventoryData[i].type === shirtName) {
          shirtInDb = inventoryData[i];
          break;
        }
      }

      if (!shirtInDb) {
        alert("Error: Shirt not found in inventory.");
        return;
      }

      // התאמת שם המידה מהטופס לשם העמודה במסד הנתונים
      var sizeColumn = "sizeM";
      if (shirtSize === "small" || shirtSize === "S") sizeColumn = "sizeS";
      else if (shirtSize === "medium" || shirtSize === "M") sizeColumn = "sizeM";
      else if (shirtSize === "large" || shirtSize === "L") sizeColumn = "sizeL";
      else if (shirtSize === "xlarge" || shirtSize === "XL") sizeColumn = "sizeXL";

      var availableStock = shirtInDb[sizeColumn] || 0;

      // שליפת העגלה מזיכרון הדפדפן וחישוב כמות הפריטים מאותו סוג שכבר הוספו
      var currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      var quantityAlreadyInCart = 0;

      for (var j = 0; j < currentCart.length; j++) {
        if (currentCart[j].shirtId === shirtName && currentCart[j].size === shirtSize) {
          quantityAlreadyInCart += parseInt(currentCart[j].quantity);
        }
      }

      // חסימת ההוספה והצגת הודעה אם הכמות המבוקשת חורגת מהמלאי הזמין
      if (quantityAlreadyInCart + shirtQuantity > availableStock) {
        alert("Cannot add to cart. Only " + availableStock + " items available in stock for this size.");
        return;
      }

      // הפעלת האנימציה ויצירת כדור מעופף לעבר סמל העגלה
      var ball = document.createElement("div");
      ball.classList.add("flying_ball");

      ball.style.top = event.clientY + "px";
      var startRightPosition = window.innerWidth - event.clientX;
      ball.style.right = startRightPosition + "px";

      document.body.appendChild(ball);

      setTimeout(function () {
        ball.style.transition = "all 0.3s ease-out";
        ball.style.right = startRightPosition - 60 + "px";
        ball.style.transform = "scale(1.3)";
      }, 10);

      setTimeout(function () {
        ball.style.transition = "all 0.8s ease-in-out";
        ball.style.top = "2%";
        ball.style.right = "2%";
        ball.style.transform = "scale(0.2)";
      }, 450);

      setTimeout(function () {
        ball.remove();
      }, 1250);

      // הוספת הפריט החדש למערך העגלה ושמירתו בזיכרון המקומי
      var shirt = {
        shirtId: shirtName,
        size: shirtSize,
        quantity: shirtQuantity,
      };

      currentCart.push(shirt);
      localStorage.setItem("cart", JSON.stringify(currentCart));
      
    })
    .catch(function(error) {
      console.log("Error checking inventory:", error);
    });
}