# Node.js Application with PostgreSQL Database Interation

Name: Johnny Nguyen
StudentID: 101185885

## Description

Node.js application which makes use of the node-postgres package to interact with a PostGres database and perform CRUD operations.
Additionally uses node:readline module to maintain user input loop.


## Instruction to run

1. Install dependencies using npm: `npm install`
2. Run application `node student-app.js`

### Functions
CRUD operations
1. getAllStudents() - Function that performs a query to fetch and returns all records within the student table (Read)
2. addStudent(first_name,last_name,email,enrollment_date) - Function that performs query to insert record for new student (Write)
3. updateStudentEmail(student_id,new_email) - Function that performs a query to update email for speicifc record by student_id (Update)
4. deleteStudent(student_id) - Function that performs a query to delete student record by id (Delete)
