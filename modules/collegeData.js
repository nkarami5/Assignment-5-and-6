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
                reject("Unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.students.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.courses.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        let foundStudent = dataCollection.students.find(student => student.studentNum == num);

        if (!foundStudent) {
            reject("Query returned 0 results");
            return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        let filteredStudents = dataCollection.students.filter(student => student.course == course);

        if (filteredStudents.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        // Adjust for checkbox 'TA' being undefined if not checked
        studentData.TA = studentData.TA === "true";

        // Assign a new studentNum
        studentData.studentNum = dataCollection.students.length + 1;

        // Add the student to the collection
        dataCollection.students.push(studentData);

        // Optionally, update the students.json file to reflect the new addition
        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 4), 'utf8', (err) => {
            if (err) {
                reject("Unable to save new student");
                return;
            }

            resolve();
        });
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.courses) {
            reject("No courses found");
            return;
        }

        let foundCourse = dataCollection.courses.find(course => course.courseId == id);

        if (!foundCourse) {
            reject("Query returned 0 results");
            return;
        }

        resolve(foundCourse);
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("No students found");
            return;
        }

        // Find the index of the student with the given studentNum
        const index = dataCollection.students.findIndex(student => student.studentNum == studentData.studentNum);

        // If the student is not found, reject the promise
        if (index === -1) {
            reject("Student not found");
            return;
        }

        // Update the student's data
        Object.assign(dataCollection.students[index], studentData);

        // Write the updated data back to the students.json file
        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 4), 'utf8', (err) => {
            if (err) {
                reject("Unable to update student");
                return;
            }

            resolve();
        });
    });
};
