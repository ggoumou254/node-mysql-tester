import {executeCommand, executeNonScalarQuery, executeQuery} from "../db_client";

const {names, uniqueNamesGenerator} = require("unique-names-generator");

const [ user = 'user', password = 'password' ] = process.argv.slice(2);
const host = 'localhost';

const config = {
    host: host,
    user: user,
    password: password
};

const uniqueNameGeneratorConfig = {
    dictionaries: [names]
}
const ages = [20, 42, 40, 30, 31, 18];
const jobs = ['student', 'developer', 'barman', 'impiegato', 'mechanic', 'other'];

const execute = async ()  => {
    await executeNonScalarQuery(config, `CREATE DATABASE IF NOT EXISTS testDb1`);

    await executeNonScalarQuery(config, `use testDb1`);

    await executeNonScalarQuery(config, `
        CREATE TABLE IF NOT EXISTS students(  
            id int NOT NULL AUTO_INCREMENT,  
            name varchar(45) NOT NULL,  
            occupation varchar(35) NOT NULL,  
            age int NOT NULL,  
            PRIMARY KEY (id)  
        );  
    `);

    // set multiple students..

    for (let i = 0; i <= 2; i++){

        const characterName = uniqueNamesGenerator(uniqueNameGeneratorConfig);
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const age = ages[Math.floor(Math.random() * ages.length)];

        await executeCommand(config, `INSERT INTO students (name, occupation, age) VALUES ('${characterName}', '${job}', ${age})`);
    }

    await executeQuery(config, `SELECT * FROM students order by id asc`, ({id, name, occupation, age}) => {
        console.log(`[-] Student ${id}: ${name},${age}-${occupation}`);
    }, 100);
}

execute().then(() => {
    console.log("Execution finished");
})
