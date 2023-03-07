const mysql = require('mysql2');

const executeWrapper = ({host, user, password, db}, executor) => {

    const c = mysql.createConnection({host, user, password});

    c.connect(function (err) {

        if (err)
            throw new Error(`mysql CONNECT failed with message ${err.message}`);

        console.log('>> Connected');

        c.query(`use ${db}`, function () {

            if (err)
                throw new Error(`mysql USE DB failed with message ${err.message}`);

            console.log(`>> DB ${db} selected.`);

            executor(c);
        });
    });

    return c;
};

function executeQuery(config, query, limit = 5) {

    executeWrapper(config, (con) => {

        con.query(query + ` limit ${limit}`, function (err, result) {

            if (err)
                throw new Error(`mysql QUERY failed with message ${err.message}`);

            if (Array.isArray(result)) {
                console.log(`>> Last ${limit} Results in Actor:`)
                result.forEach(({actor_id, first_name, last_name}) => {
                    console.log(`[-] Actor ${actor_id}: ${first_name},${last_name}`);
                })
            }
        })
    });
}

function executeCommand(config, command) {

    executeWrapper(config, (con) => {

        con.execute(command, function (err) {

            const commandToken = command.split();

            if (err)
                throw new Error(`mysql COMMAND ${commandToken} failed with message ${err.message}`);

            console.warn(`>> Command ${commandToken[0]} succeeded`);
        });

    });
}

module.exports = {executeQuery, executeCommand};
