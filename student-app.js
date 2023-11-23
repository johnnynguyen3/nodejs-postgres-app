const  { Pool } = require('pg');
const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'db.env')
});

/* Initialization of pool connection to PostgreSQL database */
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    post: process.env.PORT,
})

/* Asynchronous function that performs a query to the PostgreSQL database to retrieve all student records */
async function getAllStudents() {
    try {
        let results = await pool.query('SELECT * FROM students');
        return results.rows;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

/* Asynchronous function that performs a query to the PostgreSQL database to add new student record */
async function addStudent(first_name, last_name, email, enrollment_date) {
    try {
        let results = await pool.query('INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4) RETURNING *',[first_name,last_name,email,enrollment_date]);
        
        //Return newly inserted record
        return results.rows[0];
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

/* Asynchronous function that performs a query to the PostgreSQL datbase to update specific student record by id with new email */
async function updateStudentEmail(student_id, new_email) {
    try {

        let results = await pool.query('UPDATE students SET email = $1 WHERE student_id = $2 RETURNING *',[new_email,student_id])
        return results.rows[0];
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

/* Asynchronous function that performs a query to the PostgreSQL database to delete student record by id */
async function deleteStudent(student_id) {
    try {
        let results = await pool.query('DELETE FROM students WHERE student_id = $1 RETURNING *', [student_id]);
        return results.rows[0];
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}


/* Asynchonous block containing demonstation cases for each CRUD operation */
(async() => {
    

    /**
     * 1. getAllStudents() - Read Demo 
     */
    console.log(`Executing getAllStudents()..`);
    let students = await getAllStudents();
    for(let student of students){
        console.log(student);
    }

    /**
     * 2. addStudent(first_name,last_name,email,enrollment_date) - Write Demo
     */
    console.log("Executing addStudent()...");
    console.log("Adding new student with name 'Jayson'");
    let newStudent = await addStudent('Jayson','Tatum','jayson.tatum@example.com', new Date());
    console.log(newStudent);
    console.log("Adding new student with name 'Wardell'");
    let newStudent2 = await addStudent('Stephen','Curry','wardell.curry@warriors.com', new Date());
    console.log(newStudent2);

    /**
     * 3. updateStudentEmail(new_email, student_id) - Update Demo
     */
    console.log("Executing updateStudentEmail");
    console.log(`updating email for student ${4}`);
    let updatedEmail = await updateStudentEmail(4,'tatum.jayson@celtics.com');
    console.log(updatedEmail);

    /**
     * 4. deleteStudent(student_id) - Delete Demo
     */
    console.log("Executing deleteStudent()...");
    console.log(`Deleting student with id=${5}`); //Expected student: Wardell Curry
    let deletedStudent = await deleteStudent(5);
    console.log(deletedStudent);
    // Close the pool when finished
    pool.end();
})();

