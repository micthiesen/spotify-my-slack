const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

/* database setup */
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

/* express app setup */
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* view setup */
app.get('/', (req, res) => res.render('pages/index'));
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    res.render('pages/db', result);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

/* wait for requests */
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
