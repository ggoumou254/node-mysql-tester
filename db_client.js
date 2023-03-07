const mysql = require('mysql2');
let mysqlInstance = null;

async function getConnection({host, user, password}) {

    if (!mysqlInstance) {

        mysqlInstance = mysql.createConnection({host, user, password}).promise();

        await mysqlInstance.connect();

    }

    function getInstance() {

        return mysqlInstance;

    }

    return getInstance;
}

async function executeNonScalarQuery({host, user, password}, query) {

    const getInstance = await getConnection({host, user, password});

    const con = getInstance();

    try {

        await con.query(query);

        console.log(`>> Executed non-scalar query`);

    } catch (err) {

        throw new Error(`mysql QUERY ${query} failed with message ${err.message}`);

    }

}

async function executeQuery({host, user, password}, query, callback, limit = 5) {

    const getInstance = await getConnection({host, user, password});

    const con = getInstance();

    try {

        const result = await con.query(query + ` limit ${limit}`);

        console.log(`>> Last ${limit} Results in Actor:`);

        const rows = result[0];
        // const defs = result[1]; Definitions

        rows.forEach(callback);

    } catch (err) {

        throw new Error(`mysql QUERY ${query} failed with message ${err.message}`);

    }

}
async function executeCommand({host, user, password}, command) {

    const getInstance = await getConnection({host, user, password});

    const con = getInstance();

    try {

        await con.execute(command);

        const commandToken = command.split(' ');

        console.warn(`>> Command ${commandToken[0]} succeeded`);

    } catch (err) {

        const commandToken = command.split();

        if (err)
            throw new Error(`mysql COMMAND ${commandToken} failed with message ${err.message}`);

        console.warn(`>> Command ${commandToken[0]} succeeded`);

    }
}

module.exports = {executeQuery, executeCommand, executeNonScalarQuery};
