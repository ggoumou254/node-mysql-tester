const dbClient = require("./db_client");

const [ user = 'user', password = 'password' ] = process.argv.slice(2);

const host = 'localhost';

const config = {
    host: host,
    user: user,
    password: password
};

const execute = async ()  => {
    await dbClient.executeNonScalarQuery(config, `use sakila`);
    await dbClient.executeQuery(config, `SELECT * FROM actor order by actor_id desc`, ({actor_id, first_name, last_name}) => {
        console.log(`[-] Actor ${actor_id}: ${first_name},${last_name}`);
    }, 3);
    await dbClient.executeCommand(config, `INSERT INTO actor (first_name, last_name) VALUES ('John', 'Doe')`);
    await dbClient.executeCommand(config, `DELETE FROM actor WHERE first_name = 'John' and last_name = 'Doe'`);
};

execute().then(() => {
    console.log("Execution finished");
})

