import mysql from "mysql2";

let mysqlInstance = null;

export async function getConnection({host, user, password}) {

    if (!mysqlInstance) {

        mysqlInstance = mysql.createConnection({host, user, password}).promise();

        await mysqlInstance.connect();

    }

    function getInstance() {

        return mysqlInstance;

    }

    return getInstance;
}
export async function executeNonScalarQuery({host, user, password}, query) {

    const getInstance = await getConnection({host, user, password});

    const con = getInstance();

    try {

        await con.query(query);

        console.log(`>> Executed non-scalar query`);

    } catch (err) {

        throw new Error(`mysql QUERY ${query} failed with message ${err.message}`);

    }

}
export async function getResults({host, user, password}, query){

    try {

        const getInstance = await getConnection({host, user, password});

        const con = getInstance();

        const result = await con.query(query);

        return result[0];

    } catch (err) {

        throw new Error(`mysql QUERY ${query} failed with message ${err.message}`);

    }

}
export async function executeQuery({host, user, password}, query, callback, limit = 5) {

    const getInstance = await getConnection({host, user, password});

    const con = getInstance();

    try {

        let q = query;

        if (limit > 0) {
            q += ` limit ${limit}`;
        }

        const result = await con.query(q);

        const rows = result[0];

        console.log(`>> ${rows.length} results in Query ${query}:`);

        rows.forEach(callback);

    } catch (err) {

        throw new Error(`mysql QUERY ${query} failed with message ${err.message}`);

    }

}
export async function executeCommand({host, user, password}, command) {

    const getInstance = await getConnection({host, user, password});

    const con = getInstance();

    try {

        await con.execute(command);

        const commandToken = command.split(' ');

        console.log(`>> Command ${commandToken[0]} succeeded`);

    } catch (err) {

        const commandToken = command.split();

        if (err)
            throw new Error(`mysql COMMAND ${commandToken} failed with message ${err.message}`);

        console.log(`>> Command ${commandToken[0]} succeeded`);

    }
}
