var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: 'localhost',
	post: 3306,
	user: 'root',
	password: '',
	database: 'bamazon_db'
});

connection.connect(function(err) {
	if (err) throw err;
});

// Displays options for the manager
function displayOptions() {
	inquirer.prompt([
		{
			name: "options",
			type: "list",
			message: "Welcome! What would you like to do?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory",
			"Add New Product"]
		}
	]).then(function(answers) {
		if (answers.options === "View Products for Sale") {
			connection.query("SELECT * FROM products", function(err, res) {
				if (err) throw err;
				for (var i = 0; i < res.length; i++) {
					console.log("---------------------------------------" + 
						"\nItem Id: " + res[i].item_id + "\nProduct: " + 
						res[i].product_name + "\nPrice: " + res[i].price + 
						"\nQuantity in Stock: " + res[i].stock_quantity);
				}
			});
		}
		else if (answers.options === "View Low Inventory") {
			connection.query("SELECT * FROM products", function(err, res) {
				if (err) throw err;
				for (var i = 0; i < res.length; i++) {
					if (res[i].stock_quantity < 5) {
						console.log("---------------------------------------" + 
							"\nItem Id: " + res[i].item_id + "\nProduct: " + 
							res[i].product_name + "\nPrice: " + res[i].price + 
							"\nQuantity in Stock: " + res[i].stock_quantity);
					}
				}				
			});
		}
		else if (answers.options === "Add to Inventory") {
			// Display all items and allow manager to pick which item to add inventory to
		}
		else if (answers.options === "Add New Product") {
			// Allow the manager to add a new product to the products table in the bamazon db
		}
	});
}

// Execute displayOptions() to start program
displayOptions();