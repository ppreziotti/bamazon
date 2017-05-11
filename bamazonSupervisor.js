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

// Shows sales by department  - All columns from the department tables are selected along 
// with a custom alias to show total profit
function viewSales() {
	connection.query("SELECT department_id, department_name, overhead_costs, total_sales, total_sales-overhead_costs AS total_profit FROM departments", function(err, res) {
		if (err) throw err;
		console.table(res);
	});

// The supervisor is able to create a new department by inserting the department name 
// and overhead costs into the departments table
function newDepartment() {
	inquirer.prompt([
		{
			name: "name",
			message: "Please enter the department name:"
		},
		{
			name: "costs",
			message: "Please enter the overhead costs:",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function(answers) {
		connection.query("INSERT INTO departments SET ?",{department_name: answers.name, overhead_costs: answers.costs}, function(err, res) {
			if (err) throw err;
			console.log("Department added succesfully!");
		});
	})

}

// Execute displayOptions to start program
displayOptions();