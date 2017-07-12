CREATE DATABASE businesscard;
\c businesscard

CREATE TABLE template
(
	id SERIAL PRIMARY KEY,
	normal BOOLEAN NOT NULL,
	business BOOLEAN NOT NULL
);

CREATE TABLE card
(
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) NOT NULL,
	position VARCHAR(45),
	name VARCHAR(100) NOT NULL,
	phone VARCHAR(45) NOT NULL,
	address VARCHAR(100),
	fax VARCHAR(45),
	company VARCHAR(100) NOT NULL,
	templateid INT NOT NULL references template(id)
);

INSERT INTO template(normal, business)
VALUES (true, false);

INSERT INTO template(normal, business)
VALUES (false, true);

INSERT INTO card(email, position, name, phone, address, fax, templateid)
VALUES ('johndoe@gmail.com', 'corpse', 'John Doe', '(555)123-4567', '111 Doe Lane, Rexburg Idaho, 83440', '(123)456-7890', 1);
