var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
	host: 'localhost',
	post: 3306,
	user: 'root',
	password: '',
	database: 'bamazon_db'
});

// Displays options for the supervisor to choose from
function displayOptions() {
	inquirer.prompt([
		{
			name: "options",
			type: "list",
			message: "Welcome! What would you like to do?",
			choices: ["View Product Sales by Department", "Create New Department"]
		}
	]).then(function(answers) {
		if (answers.options === "View Product Sales by Department") {
			viewSales();
		}
		else {
			newDepartment();
		}
	});
}

function viewSales() {
	connection.query("SELECT * FROM departments", function(err, res) {
		if (err) throw err;
		console.log(res);
	});
}

function newDepartment() {
	console.log("You will be able to add a new department soon...");
}

// Execute displayOptions to start program
displayOptions();