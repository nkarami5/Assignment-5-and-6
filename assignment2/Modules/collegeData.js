

const fs = require('fs'); //Imports the fs module 

class Data { //Defines the data class for storing students and courses data
    constructor(students, courses) { //Constructor to initialize the class instance 
        this.students = students; //Assignes the passed students data to this.students
        this.courses = courses; //Assignes the passed courses data to this.courses
    }
}

let dataCollection = null; //Initializing a variable to store the data collection

function initialize() { //Defining a Function to initialize the data by reading the JSON files
    return new Promise((resolve, reject) => { //Returns a promise 
        fs.readFile('../data/students.json', 'utf8', (err, studentDataFromFile) => { //Reads students.json file
            if (err) { //Handles errors
                console.error("Error reading students.json:", err); //Logging the error to console
                reject("Unable to read students.json"); //Shows an error message when rejecting the promise
            }

            fs.readFile('../data/courses.json', 'utf8', (err, courseDataFromFile) => { //Reades courses.json file 
                if (err) { //Handles errors 
                    console.error("Error reading courses.json:", err); //Logging the error to console
                    reject("Unable to read courses.json"); //Shows an error message when rejecting the promise
                    return; //Exites the function
                }

                try { //Trying to parse JSON data
                    let studentData = JSON.parse(studentDataFromFile); //convert the JSON from the file into an array of objects
                    let courseData = JSON.parse(courseDataFromFile); //convert the JSON from the file into an array of objects

                    dataCollection = new Data(studentData, courseData); //Creates a new Data instance with parsed data
                    resolve("Data initialization successful."); //Resolving the promise with success message
                } catch (error) { //Catches parsing errors
                    console.error("Error parsing JSON data:", error); //Logging the error to console
                    reject("Error parsing JSON data."); //Shows an error message when rejecting the promise
                }
            });
        });
    });
}

function getAllStudents() { //Defines getAllStudent function to retrieve all students data
    return new Promise((resolve, reject) => { //Returns a promise 
        if (dataCollection && dataCollection.students.length > 0) { //Checks if data collection is available and contains students
            resolve(dataCollection.students); //Resolving the promise with students data
        } else {
            reject("no result returned"); //Rejecting the promise with an error message if no data available
        }
    });
}

function getTAs() { //Defining the getTAs function to retrieve TAs
    return new Promise((resolve, reject) => { //Returns a promise 
        if (dataCollection && dataCollection.students.length > 0) { //Checks if data collection is available and contains students
            const TAs = dataCollection.students.filter(student => student.TA === true); //Filtering students to get TAs
            if (TAs.length > 0) { // If there is any TAs
                resolve(TAs); //Resolving the promise with TAs data
            } else {
                reject("no results retuned"); //if no TAs found shows an error message when rejecting the promise
            }
        } else {
            reject("No students data available."); //Rejecting the promise with an error message if no data available
        }
    });
}

function getCourses() { //Defines the getCourses function to retrieve courses data
    return new Promise((resolve, reject) => { //Returns a promise 
        if (dataCollection && dataCollection.courses.length > 0) { //Checks if data collection is available and contains courses
            resolve(dataCollection.courses); //Resolving the promise with courses data
        } else {
            reject("no results retuned"); //Rejecting the promise with an error message if no data available
        }
    });
}

module.exports = { initialize, getAllStudents, getTAs, getCourses }; //Exports functions for external usage
