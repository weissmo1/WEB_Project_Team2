var initialInventory = [
  { type: "With The Wind", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "MFKDT Vision", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "Carhatt- MFKDT Style", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "Fly High", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "GOOSE Vibes", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "The PACLAPAT !", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "For The SARBAL", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "SHLAVIM", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
  { type: "GOOSE-Emec", sizeS: 20, sizeM: 20, sizeL: 20, sizeXL: 20 },
];

function addToCart(event) {
  var clickedButton = event.target;
  var shirtContainer = clickedButton.closest(".shirt_div");
  var shirtName = shirtContainer.querySelector(".name h3").textContent;
  var shirtSize = shirtContainer.querySelector('select[name="size"]').value;
  var shirtQuantity = parseInt(
    shirtContainer.querySelector('select[name="quantity"]').value,
  );
  var currentInventory = JSON.parse(localStorage.getItem("inventoryList"));
  if (!currentInventory || currentInventory.length === 0) {
    currentInventory = initialInventory;
    localStorage.setItem("inventoryList", JSON.stringify(initialInventory));
  }
  var sizeKey = "sizeM";
  if (shirtSize === "small") sizeKey = "sizeS";
  else if (shirtSize === "medium") sizeKey = "sizeM";
  else if (shirtSize === "large") sizeKey = "sizeL";
  else if (shirtSize === "xlarge") sizeKey = "sizeXL";
  var inventoryItem = currentInventory.find(
    (inv) => inv.type.toLowerCase().trim() === shirtName.toLowerCase().trim(),
  );
  var availableStock = inventoryItem ? inventoryItem[sizeKey] : 0;
  var currentCart = JSON.parse(sessionStorage.getItem("cart")) || [];

  var alreadyInCart = 0;
  currentCart.forEach((item) => {
    if (item.name === shirtName && item.size === shirtSize) {
      alreadyInCart += item.quantity;
    }
  });

  var totalRequested = shirtQuantity + alreadyInCart;
  if (totalRequested > availableStock) {
    alert(
      "Sorry! Only " +
        availableStock +
        " units left in stock for " +
        shirtName +
        " (Size: " +
        shirtSize.toUpperCase() +
        ")",
    );
    return;
  }
  var ball = document.createElement("div");
  ball.classList.add("flying_ball");

  ball.style.top = event.clientY + "px";
  let startRightPosition = window.innerWidth - event.clientX;
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

  var shirt = {
    name: shirtName,
    size: shirtSize,
    quantity: shirtQuantity,
  };

  currentCart.push(shirt);
  sessionStorage.setItem("cart", JSON.stringify(currentCart));
}
