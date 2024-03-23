const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    });
};

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        let filteredStudents = dataCollection.students.filter(student => student.TA === true);

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        let foundStudent = dataCollection.students.find(student => student.studentNum == num);

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        let filteredStudents = dataCollection.students.filter(student => student.course == course);

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

// AddStudent function
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Adjust for checkbox 'TA' being undefined if not checked
        studentData.TA = studentData.TA === "true";

        // Assign a new studentNum
        studentData.studentNum = dataCollection.students.length + 1;

        // Add the student to the collection
        dataCollection.students.push(studentData);

        // Optionally, update the students.json file to reflect the new addition
        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 4), 'utf8', (err) => {
            if (err) {
                reject("Unable to save new student"); return;
            }

            resolve();
        });
    });
};
