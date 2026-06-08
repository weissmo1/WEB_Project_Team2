var incomingCartData = JSON.parse(sessionStorage.getItem("cart")) || [];

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

function updateTotalPrice() {
  var currentItems = document.querySelectorAll(".cart-item");
  var total = 0;

  currentItems.forEach((item) => {
    var qtyText = item.querySelector(".item-details p:last-child").textContent;
    var qty = parseInt(qtyText.replace("Quantity: ", ""));
    total += qty * 40;
  });

  document.getElementById("total-price-display").textContent = total + "$";
  sessionStorage.setItem("finalPrice", total);
}

function renderCart() {
  var cartContainer = document.getElementById("cart-items-list");
  cartContainer.innerHTML = "";
  incomingCartData.forEach((shirt) => {
    var shirtHTML = `
            <div class="cart-item">
                <div class="item-details">
                    <h3>${shirt.name}</h3>
                    <p>Size: ${shirt.size}</p>
                    <p>Quantity: ${shirt.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeProduct(this)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
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
renderCart();

function removeProduct(buttonElement) {
  var isSure = confirm(
    "Are you sure you want to remove the shirt from your shopping cart?",
  );
  if (isSure) {
    var cartItemRow = buttonElement.closest(".cart-item");
    cartItemRow.remove();
    updateTotalPrice();
  }
}

document
  .querySelector(".order-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var fullName = document.getElementById("full-name").value;
    var stage = document.getElementById("course-stage").value;
    var phone = document.getElementById("phone").value;

    var currentInventory = JSON.parse(localStorage.getItem("inventoryList"));
    if (!currentInventory || currentInventory.length === 0) {
      currentInventory = initialInventory;
    }

    var currentOrders = JSON.parse(localStorage.getItem("ordersList")) || [];

    var nextId = "1001";
    if (currentOrders.length > 0) {
      nextId = (
        parseInt(currentOrders[currentOrders.length - 1].orderId) + 1
      ).toString();
    }
    var orderedItemsStrings = [];
    var totalPrice = 0;

    incomingCartData.forEach((shirt) => {
      totalPrice += shirt.quantity * 40;

      var sizeKey = "sizeM";
      var sizeLetter = "M";
      if (shirt.size === "small") {
        sizeKey = "sizeS";
        sizeLetter = "S";
      } else if (shirt.size === "medium") {
        sizeKey = "sizeM";
        sizeLetter = "M";
      } else if (shirt.size === "large") {
        sizeKey = "sizeL";
        sizeLetter = "L";
      } else if (shirt.size === "xlarge") {
        sizeKey = "sizeXL";
        sizeLetter = "XL";
      }

      orderedItemsStrings.push(
        shirt.quantity + "x " + shirt.name + " (" + sizeLetter + ")",
      );

      var inventoryItem = currentInventory.find(
        (inv) =>
          inv.type.toLowerCase().trim() === shirt.name.toLowerCase().trim(),
      );
      if (inventoryItem) {
        inventoryItem[sizeKey] -= shirt.quantity;
        if (inventoryItem[sizeKey] < 0) inventoryItem[sizeKey] = 0;
      }
    });

    var newOrder = {
      orderId: nextId,
      fullName: fullName,
      stage: stage,
      phone: phone,
      items: orderedItemsStrings.join(", "),
      price: totalPrice,
    };

    currentOrders.push(newOrder);
    localStorage.setItem("ordersList", JSON.stringify(currentOrders));
    localStorage.setItem("inventoryList", JSON.stringify(currentInventory));

    sessionStorage.removeItem("cart");

    window.location.href = "payBox.html";
  });
