var mysql = require("mysql");
var inquirer = require("inquirer");

// Creates connection to the bamazon database using mySQL
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

// Selects and displays all items from the products table
// Item id, product name, department name, and price are all shown
function displayItems() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("--------------------------------------------------" + 
			"\nItem Id: " + res[i].item_id + "\nProduct: " + res[i].product_name +
			"\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price);
		}
		// User inputs the item id of the product they would like to purchase along with
		// the quantity of the product, and then the transaction is completed
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
			// The user is given the total cost of his/her purchase. The stock quantity and product sales 
			// for the product are updated in the products table and the total sales for the appropriate 
			// department is updated in the departments table
			if (chosenItem.stock_quantity >= answers.quantity) {
				var chosenDepartment;
				var departmentSales;
				var totalCost = chosenItem.price * answers.quantity;
				connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: chosenItem.stock_quantity - parseInt(answers.quantity), product_sales: chosenItem.product_sales + totalCost}, {item_id: chosenItem.item_id}], function(err, res) {
					if (err) throw err;
					connection.query("SELECT department_name, total_sales FROM departments WHERE ?", {department_name: chosenItem.department_name}, function(err, res) {
						if (err) throw err;
						chosenDepartment = res[0].department_name;
						departmentSales = res[0].total_sales;
						connection.query("UPDATE departments SET ? WHERE ?", [{total_sales: departmentSales + totalCost}, {department_name: chosenDepartment}], function(err, res) {
							if (err) throw err;
							console.log("Thank you for your purchase! Your total cost is $" + totalCost + ".");
							startOver();
						});
					});
				});
			}
			else {
				console.log("We are very sorry. There is insufficient stock for your order.");
				startOver();
			}
		});
	});
}

// Asks the user if they would like to purchase another item and executes displayItems
// if they confirm
function startOver() {
	inquirer.prompt([
		{
			name: "confirm",
			type: "confirm",
			message: "Would you like to order something else?"
		}
	]).then(function(answer) {
		if (answer.confirm === true) {
			displayItems();
		}
		else {
			console.log("Thank you for shopping with us. Come back again soon!");
		}
	});
}

// Execute displayItems() at start of the application
displayItems();