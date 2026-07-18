// מערכים גלובליים לשמירת הנתונים
var inventoryList = [];
var ordersList = [];

// פונקציה למשיכת נתוני המלאי מהשרת
function fetchInventory() {
  fetch('/inventory')
    .then((response) => response.json())
    .then((data) => {
      // שמירת הנתונים במערך וקריאה לפונקציה שמעדכנת את המסך
      inventoryList = data;
      drawInventory();
    })
    .catch((error) => console.log("Error fetching inventory:", error));
}

// פונקציה למשיכת טבלת ההזמנות מהשרת
function fetchOrders() {
  fetch("/orders")
    .then((response) => response.json())
    .then((data) => {
      ordersList = data;
      drawOrders();
    })
    .catch((error) => console.log("Error fetching orders:", error));
}

// פונקציה שאחראית על יצירת טבלת המלאי ב-HTML
function drawInventory() {
  var inventoryTable = document.getElementById("inventoryTable");
  if (!inventoryTable) return;
  
  // הגדרת שורת הכותרות של הטבלה
  var htmlContent = "<tr><th>Shirt</th><th>S</th><th>M</th><th>L</th><th>XL</th></tr>";

  // מעבר על המערך ויצירת שורות טבלה לכל פריט במלאי
  for (var i = 0; i < inventoryList.length; i++) {
    htmlContent += "<tr>";
    htmlContent += "<td>" + (inventoryList[i].type || "") + "</td>";
    htmlContent += "<td>" + (inventoryList[i].sizeS ?? 0) + "</td>";
    htmlContent += "<td>" + (inventoryList[i].sizeM ?? 0) + "</td>";
    htmlContent += "<td>" + (inventoryList[i].sizeL ?? 0) + "</td>";
    htmlContent += "<td>" + (inventoryList[i].sizeXL ?? 0) + "</td>";
    htmlContent += "</tr>";
  }
  
  // הכנסת המחרוזת שיצרנו לתוך אלמנט הטבלה
  inventoryTable.innerHTML = htmlContent;
}

// פונקציה לייצור והצגת טבלת ההזמנות
function drawOrders() {
  var ordersTable = document.getElementById("ordersTable");
  if (!ordersTable) return;

  var htmlContent = "<tr><th>Order ID</th><th>Full Name</th><th>Course Stage</th><th>Phone</th><th>Shirts Ordered</th><th>Order Price</th></tr>";

  // פירוק הנתונים מתוך המערך והכנסתם לטבלה
  for (var j = 0; j < ordersList.length; j++) {
    var orderId = ordersList[j].orderId || ordersList[j].id || ordersList[j].order_id || "";
    var fullName = ordersList[j].fullName || ordersList[j].full_name || "";
    var stage = ordersList[j].stage || ordersList[j].course_stage || "";
    var phone = ordersList[j].phone || "";
    var price = ordersList[j].price !== undefined ? ordersList[j].price : "0";
    
    // בדיקה מאיזו עמודה למשוך את נתוני החולצות שהוזמנו בהתאם למבנה
    var items = ordersList[j].shirts_ordered || ordersList[j].items || "";
    if (!items && ordersList[j].shirt_id) {
       items = ordersList[j].shirt_id + " (" + (ordersList[j].size || "") + " x" + (ordersList[j].quantity || 1) + ")";
    }

    htmlContent += "<tr>";
    htmlContent += "<td>" + orderId + "</td>";
    htmlContent += "<td>" + fullName + "</td>";
    htmlContent += "<td>" + stage + "</td>";
    htmlContent += "<td>" + phone + "</td>";
    htmlContent += "<td>" + items + "</td>";
    htmlContent += "<td>" + price + " $</td>";
    htmlContent += "</tr>";
  }
  
  ordersTable.innerHTML = htmlContent;
}

// פונקציה לאיפוס המערכת והטבלאות בשרת
function resetSystem() {
  let isSure = confirm("Are you sure you want to reset all inventory and order history?");
  if (!isSure) return;

  fetch("/reset", {
    method: "POST",
  })
    .then((response) => response.json())
    .then(() => {
      // רענון העמוד אחרי שהאיפוס בוצע בהצלחה
      location.reload();
    })
    .catch((error) => console.log("Error resetting system:", error));
}

// פונקציה להוספת פריטים למלאי דרך הטופס בעמוד
function addInventory() {
  var typeSelect = document.getElementById("add-shirt-type").value;
  var sizeSelect = document.getElementById("add-shirt-size").value;
  var qtyInput = parseInt(document.getElementById("add-shirt-qty").value);

  // בדיקת תקינות בסיסית לכמות
  if (!(qtyInput > 0)) return;

  // העברת הנתונים לשרת
  fetch("/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: typeSelect,
      size: sizeSelect,
      qty: qtyInput,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Failed to add inventory.");
        });
      }
      return response.json();
    })
    .then(() => {
      // עדכון הטבלה במסך ואיפוס השדה של הכמות
      fetchInventory();
      document.getElementById("add-shirt-qty").value = 1;
    })
    .catch((error) => {
      console.log("Error adding inventory:", error);
      alert(error.message);
    });
}

// הפעלת פונקציות המשיכה ברגע שתוכן העמוד נטען לחלוטין
document.addEventListener("DOMContentLoaded", function () {
  fetchInventory();
  fetchOrders();
});