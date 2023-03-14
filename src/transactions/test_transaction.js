import {executeCommand, executeNonScalarQuery, executeQuery, getResults} from "../db_client.js";

const [ user = 'user', password = 'password', ilv, delay = 0 ] = process.argv.slice(2);

const config = {
    host: 'localhost',
    user: user,
    password: password
};

const dbName = 'easybank';

const executeTransaction = async (dbClient, transactionLevel, delay)  => {

    // user wants to pay 100 to buying something

    const newExpenseAmount = 100;

    // set transaction settings

    await setTransaction(dbClient, transactionLevel);

    await timeout(delay);

    // does the user has 100 euros on his accounts?

    let transactions = await getResults(config, `SELECT * FROM transactions`);

    console.warn(`Now transactions are: ${transactions.length}`);

    await timeout(delay);  // DELAY OF READING

    transactions = await getResults(config, `SELECT * FROM transactions`);

    console.warn(`Now transactions are: ${transactions.length}`);

    const accountBalance = transactions
        .map((a) => parseFloat(a.amount))
        .reduce((a, b) => a + b);

    if (accountBalance >= newExpenseAmount) {

        console.log(`User can make a new transaction of ${newExpenseAmount}, because he has ${accountBalance}`);

        await executeCommand(config, `INSERT INTO transactions (amount, userId) VALUES (${newExpenseAmount * -1}, 1)`);

        // BLOCK HERE ON SZ
        await executeNonScalarQuery(config, `COMMIT`);

    } else {

        console.error(`User can NOT make a new transaction of ${newExpenseAmount}, because he has ${accountBalance}`);

    }

}

executeTransaction(ilv, delay).then(() => {
    console.log('transaction executed');
})

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setTransaction(transactionLevelId) {

    const isolationLevels = []
    isolationLevels['RR'] = 'REPEATABLE READ';
    isolationLevels['RU'] = 'READ UNCOMMITTED';
    isolationLevels['RC'] = 'READ COMMITTED';
    isolationLevels['SZ'] = 'SERIALIZABLE';

    await executeNonScalarQuery(config, `SET SESSION TRANSACTION ISOLATION LEVEL ${isolationLevels[transactionLevelId]}`);
    await executeNonScalarQuery(config, `START TRANSACTION`);
    await executeNonScalarQuery(config, `SET AUTOCOMMIT = 0`);
    await executeNonScalarQuery(config, `use ${dbName}`);

    await executeQuery(config, `SELECT CONNECTION_ID() as connection_id`, (result) => {
        console.log(result['connection_id']);
    }, -1);
    await executeQuery(config, `SELECT @@transaction_ISOLATION as isolation`, (result) => {
        console.log(result['isolation']);
    }, -1);

}
