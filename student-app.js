const  { Pool } = require('pg');
const path = require('path');
const readline = require('readline');

let r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
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
    console.log("Node.js Application with PostgreSQL Database Interation ")
    console.log("===================================================================");
    console.log("Operations:")
    console.log("1. Read - getAllStudents()");
    console.log("2. Write - addStudent(first_name,last_name,email,enrollment_date)");
    console.log("3. Update - updateStudentEmail(student_id,new_email)");
    console.log("4. Delete - deleteStudent(student_id)");
    console.log("5. Exit - exits program")
    console.log("===================================================================");

    //Function to prompt for user input & input handling
    var promptUser = function () {
        console.log("Specify Operation (0-5)")
        r1.question("If parameters are necessary, seperate with spaces in-between: ", async input => {
            var arrayinputs = input.trim().split(/\s+/);
            if(parseInt(arrayinputs[0]) == 1){
                /**
                 * 1. getAllStudents() - Read Demo 
                 */
                console.log(`Executing getAllStudents()..`);
                let students = await getAllStudents();
                for(let student of students){
                    console.log(student);
                }

                promptUser();
            }else if(parseInt(arrayinputs[0]) == 2){
                /**
                 * 2. addStudent(first_name,last_name,email,enrollment_date) - Write Demo
                 */
                //Formats parameters
                let firstName = arrayinputs[1];
                let lastName = arrayinputs[2];
                let email = arrayinputs[3];
                let enrollmentDate = new Date(arrayinputs[4]);
                console.log("Executing addStudent()...");
                console.log(`Adding new student with name: ${firstName} ${lastName}`);

                //Calls write function addStudent() to initiate DB query.
                let newStudent = await addStudent(firstName,lastName,email, enrollmentDate);
                console.log(newStudent);

                promptUser();
            }else if(parseInt(arrayinputs[0]) == 3){
                /**
                 * 3. updateStudentEmail(student_id, new_email) - Update Demo
                 */
                //Format parameters
                let studentID = parseInt(arrayinputs[1]);
                let newEmail = arrayinputs[2];
                console.log("Executing updateStudentEmail");
                console.log(`updating email for student ${studentID}`);


                //Calls update function updateStudentEmail() to initiate DB query.
                let updatedEmail = await updateStudentEmail(studentID,newEmail);
                console.log(updatedEmail);

                promptUser();
            }else if(parseInt(arrayinputs[0]) == 4) {
                /**
                 * 4. deleteStudent(student_id) - Delete Demo
                 */

                //Format parameters
                let studentID = arrayinputs[1];
                console.log("Executing deleteStudent()...");
                console.log(`Deleting student with id=${studentID}`);

                //Calls delete function deleteStudent() to initiate DB query.
                let deletedStudent = await deleteStudent(studentID);
                console.log(deletedStudent);

                promptUser();
            }else if(parseInt(arrayinputs[0]) == 5){
                console.log("Exiting application...");
                pool.end();
                r1.close();
            } else {
                console.log("Not a valid input please try again");
                promptUser();
            }
        })
    }
    promptUser(); //Call to initiate application loop
})();

