const sql = require("./db.js"); 

const getInventory = async function(req, res) {
  const query = "SELECT * FROM inventory";
  try {
    const [rows] = await sql.query(query);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    return res.status(500).json({ error: "Failed to fetch inventory." });
  }
};


// טיפול בעגלת הקניות
const processCheckout = function(fullName, phone, stage, cartItems, callback) {
    if (!cartItems || cartItems.length === 0) {
        return callback(null); // אם העגלה ריקה,  מסיים
    }

    let completedQueries = 0;
    let hasError = false;

    // רץ על כל פריט בעגלה
    cartItems.forEach(item => {
        // הוספת ההזמנה לטבלת ההזמנות
        const insertOrder = `
            INSERT INTO orders (full_name, phone, stage, shirt_id, size, quantity) 
            VALUES ('${fullName}', '${phone}', '${stage}', '${item.shirtId}', '${item.size}', ${item.quantity})
        `;
        
        sql.query(insertOrder, (err) => {
            if (err) {
                console.log("error in insertOrder: ", err);
                if (!hasError) { hasError = true; return callback(err); }
            }

            let sizeColumn = "sizeM";
            if (item.size === "small") sizeColumn = "sizeS";
            else if (item.size === "medium") sizeColumn = "sizeM";
            else if (item.size === "large") sizeColumn = "sizeL";
            else if (item.size === "xlarge") sizeColumn = "sizeXL";

            const updateStock = `
                UPDATE inventory 
                SET ${sizeColumn} = ${sizeColumn} - ${item.quantity} 
                WHERE type = '${item.shirtId}' 
            `; 
            
            sql.query(updateStock, (err) => {
                if (err) {
                    console.log("error in updateStock: ", err);
                    if (!hasError) { hasError = true; return callback(err); }
                }
                completedQueries++;                
                if (completedQueries === cartItems.length && !hasError) {
                    callback(null);
                }
            });
        });
    });
};


module.exports = { 
    getInventory,
    processCheckout 
};