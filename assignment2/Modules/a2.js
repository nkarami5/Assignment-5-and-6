const collegeData = require('./collegeData'); //Imports the module collegeData

collegeData.initialize() //Initialize the data 
    .then(() => { //Handls promise resolution
        return collegeData.getAllStudents(); //Calling getAllStudents and getting students
    })
    .then(students => {  //Handls promise resolution after getting students
        console.log(`Successfully retrieved ${students.length} students`); //Logging the number of retrieved students
        return collegeData.getCourses(); //Calls the getCourse function and return the results
    })
    .then(courses => { 
        console.log(`Successfully retrieved ${courses.length} courses`); //Logging the number of retrieved students
        return collegeData.getTAs(); //Returns a promise to get all courses
    })
    .then(TAs => { //Handling promise resolution after getting Teaching Assistants
        console.log(`Successfully retrieved ${TAs.length} TAs`); //Logging the number of retrieved TAs
    })
    .catch(error => { //Handles errors happened during the process
        console.error("Error:", error); //Logging the error message
    });
