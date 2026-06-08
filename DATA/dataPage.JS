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
var initialOrders = [];

if (!localStorage.getItem("inventoryList")) {
  localStorage.setItem("inventoryList", JSON.stringify(initialInventory));
}
if (!localStorage.getItem("ordersList")) {
  localStorage.setItem("ordersList", JSON.stringify(initialOrders));
}

var inventoryList = JSON.parse(localStorage.getItem("inventoryList"));
var ordersList = JSON.parse(localStorage.getItem("ordersList"));

function drawInventory() {
  var inventoryTable = document.getElementById("inventoryTable");
  inventoryTable.innerHTML =
    "<tr><th>Shirt</th><th>S</th><th>M</th><th>L</th><th>XL</th></tr>";

  for (var i = 0; i < inventoryList.length; i++) {
    var row = "<tr>";
    row += "<td>" + inventoryList[i].type + "</td>";
    row += "<td>" + inventoryList[i].sizeS + "</td>";
    row += "<td>" + inventoryList[i].sizeM + "</td>";
    row += "<td>" + inventoryList[i].sizeL + "</td>";
    row += "<td>" + inventoryList[i].sizeXL + "</td>";
    row += "</tr>";
    inventoryTable.innerHTML += row;
  }
}

function drawOrders() {
  var ordersTable = document.getElementById("ordersTable");
  ordersTable.innerHTML =
    "<tr><th>Order ID</th><th>Full Name</th><th>Course Stage</th><th>Phone</th><th>Shirts Ordered</th><th>Order Price</th></tr>";

  for (var j = 0; j < ordersList.length; j++) {
    var orderRow = "<tr>";
    orderRow += "<td>" + ordersList[j].orderId + "</td>";
    orderRow += "<td>" + ordersList[j].fullName + "</td>";
    orderRow += "<td>" + ordersList[j].stage + "</td>";
    orderRow += "<td>" + ordersList[j].phone + "</td>";
    orderRow += "<td>" + ordersList[j].items + "</td>";
    orderRow += "<td>" + ordersList[j].price + " $</td>";
    orderRow += "</tr>";
    ordersTable.innerHTML += orderRow;
  }
}

drawInventory();
drawOrders();

function resetSystem() {
  let isSure = confirm(
    "Are you sure you want to reset all inventory and order history?",
  );

  if (isSure) {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  }
}

function addInventory() {
  var typeSelect = document.getElementById("add-shirt-type").value;
  var sizeSelect = document.getElementById("add-shirt-size").value;
  var qtyInput = parseInt(document.getElementById("add-shirt-qty").value);

  if (qtyInput > 0) {
    for (var i = 0; i < inventoryList.length; i++) {
      if (inventoryList[i].type === typeSelect) {
        inventoryList[i][sizeSelect] += qtyInput;
        break;
      }
    }

    localStorage.setItem("inventoryList", JSON.stringify(inventoryList));
    drawInventory();

    document.getElementById("add-shirt-qty").value = 1;
  }
}
