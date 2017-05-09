CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	price DECIMAL(6,2) NOT NULL,
	stock_quantity INT NOT NULL,
	PRIMARY KEY (item_id)
);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10,2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dell Latitude E5570 Laptop Computer", "Electronics", 1500.00, 10),
("Bob Dylan 'Blonde on Blonde' Vinyl", "Music", 49.99, 5),
("Autographed Adam Jones Orioles Jersey", "Sports", 200.00, 1),
("Counter Culture Coffee - 12 oz Whole Bean", "Grocery", 13.99, 7),
("'Breakfast of Champions' by Kurt Vonnegut", "Books", 10.99, 15),
("Wireless Keyboard and Mouse Combo", "Electronics", 79.99, 13),
("The Beatles 'Abbey Road' Vinyl", "Music", 39.99, 7),
("US Men's National Soccer Team Banner", "Sports", 64.99, 2),
("Videri Chocolate Bar - Classic Dark", "Grocery", 7.00, 9),
("'Ham on Rye' by Charles Bukowski", "Books", 9.99, 6);

CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL,
	deparment_name VARCHAR(50) NOT NULL,
	overhead_costs DECIMAL(10,2) NOT NULL,
	total_sales DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (department_id)
);

ALTER TABLE departments
CHANGE deparment_name department_name VARCHAR(50);

INSERT INTO departments (department_name, overhead_costs, total_sales)
VALUES ("Electronics", 4500.00, 0),
("Music", 250.00, 0),
("Sports", 200.00, 0),
("Grocery", 75.00, 0),
("Books", 75.000, 0);