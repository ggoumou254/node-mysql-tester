import {executeCommand, executeNonScalarQuery} from "../db_client.js";

const [ user = 'user', password = 'password' ] = process.argv.slice(2);

const config = {
    host: 'localhost',
    user: user,
    password: password
};

const dbName = 'easybank';

const createTestDatabase = async ()  => {

    await executeNonScalarQuery(config, `DROP DATABASE IF EXISTS ${dbName}`);
    await executeNonScalarQuery(config, `CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await executeNonScalarQuery(config, `use ${dbName}`);
    await executeNonScalarQuery(config, `
        CREATE TABLE IF NOT EXISTS transactions(  
            id int NOT NULL AUTO_INCREMENT,  
            amount decimal(10,2) signed NOT NULL,  
            userId int unsigned NOT NULL,  
            createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)  
        );
    `);
};

const createFirstTransaction = async () => {
    await executeCommand(config, `INSERT INTO transactions (amount, userId) VALUES (100, 1)`);
};

createTestDatabase().then(() => {
    createFirstTransaction().then(() => {
        //
    })
})
