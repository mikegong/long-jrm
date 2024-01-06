import DatabaseConnectionPool from "../connection/pool.js";
import Db from "../database/db.js";

const mysqlDbName = "mysql-test";
const postgresDbName = "postgres-test";
const databaseName = postgresDbName;

const dbConnectionPool = new DatabaseConnectionPool();

try {
    await dbConnectionPool.initializePool(databaseName);
    await dbConnectionPool.startPool(databaseName);
    console.log('Pool initialized');
} catch (error) {
    console.log(error.message);
    throw error;
}

let connection = null;

try {
    connection = await dbConnectionPool.getConnection(databaseName);
    const db = new Db(connection);
    const result = await db.select({
        table: "sample",
        columns: ["*"],
        where: [{
            "c2": {
                "operator": "=",
                "value": "1",
                "placeholder": "Y"
            }
        }]
    });
    console.log(result.data);
    await dbConnectionPool.releaseConnection(databaseName, connection);
    console.log('Connection released');
} catch (error) {
    console.log(error.message);
    throw error;
}

// const size1 = await dbConnectionPool.getPoolSize(databaseName);
// console.log('Pool size 1: ' + size1);

await dbConnectionPool.drainDatabasePool(databaseName);

// const size2 = await dbConnectionPool.getPoolSize(databaseName);
// console.log('Pool size 2: ' + size2);