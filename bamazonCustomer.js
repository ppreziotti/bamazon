var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: 'localhost',
	post: 3306,
	user: 'root',
	password: "",
	database: 'bamazon_db'
});

connection.connect(function(err) {
	if (err) throw err;
});

// Displays all items available with item id, product name, department name, and price
function displayItems() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("--------------------------------------------------" + 
				"\nItem Id: " + res[i].item_id + "\nProduct: " + res[i].product_name +
				"\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price);
		}
		inquirer.prompt([
			{
				name: "id",
				message: "Please enter the 'Item Id' of the product you would like to purchase:",
				validate: function(value) {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				}
			},
			{
				name: "quantity",
				message: "Please enter the quantity of the product you would like to purchase:",
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
			if (chosenItem.stock_quantity >= answers.quantity) {
				connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: parseInt(chosenItem.stock_quantity) - parseInt(answers.quantity)}, {item_id: chosenItem.item_id}], function(err, res) {
					if (err) throw err;
					var totalCost = chosenItem.price * answers.quantity;
					console.log("Thank you for your purchase! Your total cost is $" + totalCost + ".");
				});
			}
			else {
				console.log("We are very sorry. There is insufficient stock for your order.");
			}
		});
	});
}

// Execute displayItems() at start of the application
displayItems();