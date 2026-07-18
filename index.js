// קובץ שמטפל בממשק מול השרת
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2/promise");
var sql = require("./db.js"); 
const app = express();
const PORT = 3000;
const fs = require("fs");
const crad_functions = require("./CRUD.functions.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/HOMEPAGE", express.static(path.join(__dirname, "HOMEPAGE")));
app.use("/ORDER", express.static(path.join(__dirname, "ORDER")));
app.use("/PAYMENT", express.static(path.join(__dirname, "PAYMENT")));
app.use("/DATA", express.static(path.join(__dirname, "DATA")));
app.use("/PICTURES", express.static(path.join(__dirname, "PICTURES")));
app.use("/SHIRTS", express.static(path.join(__dirname, "SHIRTS")));

//התחברות פורטל העובדים
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "HOMEPAGE", "homepage.html"));
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send("Missing credentials");
  }

  try {
    // בדיקה האם קיים משתמש עם השם והסיסמה הספציפיים במסד הנתונים
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    const [rows] = await sql.query(query, [username, password]);

    // אם חזרה שורה, סימן שהנתונים תואמים
    if (rows.length > 0) {
      res.status(200).send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// מלאי
app.get("/inventory", crad_functions.getInventory);

app.post("/inventory", async (req, res) => {
  const { type, size, qty } = req.body;
  if (!type || !size || qty === undefined || qty === null) {
    return res.status(400).json({ error: "Missing required fields: type, size, qty." });
  }
  const qtyNumber = parseInt(qty, 10);
  if (isNaN(qtyNumber) || qtyNumber <= 0) {
    return res.status(400).json({ error: "qty must be a positive number." });
  }

  let sizeColumn = "sizeM";
  if (size === "sizeS" || size === "S" || size === "small") sizeColumn = "sizeS";
  else if (size === "sizeM" || size === "M" || size === "medium") sizeColumn = "sizeM";
  else if (size === "sizeL" || size === "L" || size === "large") sizeColumn = "sizeL";
  else if (size === "sizeXL" || size === "XL" || size === "xlarge") sizeColumn = "sizeXL";

  try {
    const query = `UPDATE inventory SET ${sizeColumn} = ${sizeColumn} + ? WHERE type = ?`;
    const [result] = await sql.query(query, [qtyNumber, type]);
    res.json({ message: "Inventory updated successfully.", result });
  } catch (err) {
    console.error("Error updating inventory:", err);
    res.status(500).json({ error: "Failed to update inventory." });
  }
});

// הזמנות
app.get("/orders", async (req, res) => {
  try {
    const [rows] = await sql.query("SELECT * FROM orders");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

app.post("/orders", async (req, res) => {
  const { fullName, stage, phone, items, price, shirt_id, size, quantity } = req.body;
  if (!fullName || !stage || !phone || !items || price === undefined) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    const query = `INSERT INTO orders (full_name, phone, stage, shirt_id, size, quantity, items, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await sql.query(query, [
      fullName, 
      phone, 
      stage, 
      shirt_id || items || "General", 
      size || "M", 
      quantity || 1, 
      items, 
      price
    ]);
    res.json({ message: "Order created successfully.", result });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order." });
  }
});

// איפוס מלאי והזמנות
app.post("/reset", async (req, res) => {
  try {
    await sql.query("UPDATE inventory SET sizeS = 20, sizeM = 20, sizeL = 20, sizeXL = 20");
    await sql.query("TRUNCATE TABLE orders");
    res.json({ message: "System reset successfully." });
  } catch (err) {
    console.error("Error resetting system:", err);
    res.status(500).json({ error: "Failed to reset system." });
  }
});

//קליטת הזמנה מהעגלה
app.post('/api/checkout', async (req, res) => {
    const fullName = req.body.fullName;
    const phone = req.body.phone;
    const stage = req.body.stage;
    
    let cartItems = [];
    try {
        cartItems = JSON.parse(req.body.cartData);
    } catch (e) {
        return res.status(400).send("Invalid cart data.");
    }

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).send("Cart is empty.");
    }

    let totalPrice = 0;
    let itemsSummary = "";

    for (const item of cartItems) {
        const qty = parseInt(item.quantity) || 1;
        totalPrice += qty * 40; 
        itemsSummary += `${qty}x ${item.shirtId} (Size: ${item.size}), `; 
    }
    if (itemsSummary.length > 0) itemsSummary = itemsSummary.slice(0, -2); 

    const firstItem = cartItems[0] || {};
    const shirtIdVal = firstItem.shirtId || "Mixed Order";
    const sizeVal = firstItem.size || "M";
    const qtyVal = firstItem.quantity || 1;

    try {
        const insertOrder = `INSERT INTO orders (full_name, phone, stage, shirt_id, size, quantity, items, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        await sql.query(insertOrder, [fullName, phone, stage, shirtIdVal, sizeVal, qtyVal, itemsSummary, totalPrice]);

        for (const item of cartItems) {
            let sizeColumn = "sizeM";
            if (item.size === "small" || item.size === "sizeS" || item.size === "S") sizeColumn = "sizeS";
            else if (item.size === "medium" || item.size === "sizeM" || item.size === "M") sizeColumn = "sizeM";
            else if (item.size === "large" || item.size === "sizeL" || item.size === "L") sizeColumn = "sizeL";
            else if (item.size === "xlarge" || item.size === "sizeXL" || item.size === "XL") sizeColumn = "sizeXL";

            const updateStock = `UPDATE inventory SET ${sizeColumn} = ${sizeColumn} - ? WHERE type = ?`; 
            await sql.query(updateStock, [item.quantity, item.shirtId]);
        }

        res.send(`
            <script>
                localStorage.removeItem("cart");
                window.location.href = "/PAYMENT/payBox.html"; 
            </script>
        `);
    } catch (err) {
        console.error("Error processing checkout:", err);
        res.status(500).send("Database error during checkout.");
    }
});

// הפעלת שרת והגדרת בסיס הנתונים
  app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL
      )
    `);

    const [userRows] = await sql.query("SELECT COUNT(*) as count FROM users");
    if (userRows[0].count === 0) {
        const defaultUsers = [
            ["NITZAN", "1234"],
            ["MORDI", "1212"],
            ["BRAFMAN", "1111"],
            ["ITZIK", "6666"]
        ];
        for (const user of defaultUsers) {
            await sql.query("INSERT INTO users (username, password) VALUES (?, ?)", user);
        }
        console.log("Users table ready and seeded.");
    }

    const [inventoryRows] = await sql.query("SELECT COUNT(*) as count FROM inventory");
    if (inventoryRows[0].count === 0) {
        const defaultShirts = [
            "With The Wind", "MFKDT Vision", "Carhatt- MFKDT Style", 
            "Fly High", "GOOSE Vibes", "The PACLAPAT !", 
            "For The SARBAL", "SHLAVIM", "GOOSE-Emec"
        ];
        for (const shirt of defaultShirts) {
            await sql.query("INSERT INTO inventory (type, sizeS, sizeM, sizeL, sizeXL) VALUES (?, 20, 20, 20, 20)", [shirt]);
        }
        console.log("Inventory table ready (seeded with 20 units default).");
    }
  } catch (e) {
      console.log("Database tables verified and ready.", e);
  }
});