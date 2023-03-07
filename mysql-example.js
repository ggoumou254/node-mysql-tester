const dbClient = require("./db_client");

const [ user = 'user', password = 'password' ] = process.argv.slice(2);

const dbName = 'sakila';
const host = 'localhost';

const config = {
    host: host,
    user: user,
    password: password,
    db: dbName
};

dbClient.executeQuery(config, `SELECT * FROM actor order by actor_id desc`, 3);
dbClient.executeCommand(config, `INSERT INTO actor (first_name, last_name) VALUES ('John', 'Doe')`);
dbClient.executeCommand(config, `DELETE FROM actor WHERE first_name = 'John' and last_name = 'Doe'`);
