const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123', 
  host: 'localhost',
  database: 'bootcampx'
});

const cohortName = process.argv[2];
const limit = process.argv[3] || 5;
//store potentially malicious sql injections into an array
const values = [`%${cohortName}`, limit];

//query string
const queryString = `
  SELECT DISTINCT students.id as student_id, student.name as name, cohorts.name as cohort
  FROM students
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  LIMIT $2;
`;

//pool query
pool.query(queryString, values)
.then(res => {
  res.rows.forEach(user => {
    console.log(`${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`);
  })
}).catch(err => console.error('query error', err.stack));