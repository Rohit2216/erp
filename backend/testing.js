const mysql = require("mysql");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rohit@2309",
  database: "cms_electrical",
});

// Promisify the query method for better control
const queryPromise = (query) => {
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) {
          console.log(`Query Error: ${error.sqlMessage}`); // Log query errors
          return reject(error);
        }
        resolve(results);
      });
    });
  };
  
  // Async function to handle the altering of tables
  const alterTables = async () => {
    try {
      console.log('Connecting to MySQL database...');
      connection.connect();
  
      console.log('Fetching all table names...');
      // Fetch all table names
      const tables = await queryPromise("SHOW TABLES");
      console.log(`Found ${tables.length} tables in the database.`);
  
      // Iterate over each table and alter the `id` field
      for (const table of tables) {
        const tableName = table[`Tables_in_${connection.config.database}`]; // Fetch the table name
        console.log(`Altering table: ${tableName}`);
  
        // Alter query to set the `id` as PRIMARY KEY with AUTO_INCREMENT
        const alterQuery = `ALTER TABLE ${tableName} MODIFY id INT NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (id)`;
        
        try {
          await queryPromise(alterQuery);
          console.log(`Successfully altered table: ${tableName}`);
        } catch (err) {
          console.log(`Error altering table ${tableName}: ${err.sqlMessage}`);
        }
      }
  
      console.log('All tables have been processed.');
    } catch (error) {
      console.error('Error in processing:', error.message);
    } finally {
      console.log('Closing MySQL connection...');
      connection.end();
    }
  };
  
  // Run the function to alter the tables
  alterTables();