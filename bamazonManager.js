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
		// Selects all products for sale from the products table and then displays them
		// with item id, product name, price, and stock quantity
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
			// Selects all products for sale from the products table and then displays
			// them and allows the manager to pick which item to add inventory to
			connection.query("SELECT * FROM products", function(err, res) {
				if (err) throw err;
				for (var i = 0; i < res.length; i++) {
					console.log("---------------------------------------" + 
						"\nItem Id: " + res[i].item_id + "\nProduct: " + 
						res[i].product_name + "\nPrice: " + res[i].price + 
						"\nQuantity in Stock: " + res[i].stock_quantity);
				}
				inquirer.prompt([
					{
						name: "id",
						message: "Please enter the 'Item Id' of the product you would like to increase inventory for:",
						validate: function(value) {
							if (isNaN(value) === false) {
								return true;
							}
							return false;
						}
					},
					{
						name: "quantity",
						message: "Please enter the quantity of the product you would like to add to inventory:",
						validate: function(value) {
							if (isNaN(value) === false) {
								return true;
							}
							return false;
						}
					}
				]).then(function(answers) {
					var chosenItem;
					for (var i = 0; i < res.length; i++) {
						if (res[i].item_id === parseInt(answers.id)) {
							chosenItem = res[i];
						}
					}
					connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: parseInt(chosenItem.stock_quantity) + parseInt(answers.quantity)}, {item_id: chosenItem.item_id}], function(err, res) {
						if (err) throw err;
						console.log("The product quantity has been succesfully updated.");
					});
				});
			});
		}
		else if (answers.options === "Add New Product") {
			// Allows the manager to add a new product to the products table in the bamazon db
			inquirer.prompt([
				{
					name: "name",
					message: "Please enter the product name:"
				},
				{
					name: "department",
					message: "Please enter the product department: "
				},
				{
					name: "price",
					message: "Please enter the product price:"
				},
				{
					name: "quantity",
					message: "Please enter the quantity in stock:"
				}
			]).then(function(answers) {
				connection.query("INSERT INTO products SET ?", {product_name: answers.name,
					department_name: answers.department, price: answers.price, 
					stock_quantity: answers.quantity}, function(err, res) {
						if (err) throw (err);
						console.log("Product added succesfully!");
					});	
			});
		}
	});
}

// Executes displayOptions() to start program
displayOptions();