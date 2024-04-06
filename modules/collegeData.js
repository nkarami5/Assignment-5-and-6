const Sequelize = require('sequelize');
const sequelize = new Sequelize('ccweeoww', 'ccweeoww', 'nj5LOzn-TJRPH9xd3Qby7ouTfpuXy65U', {
    host: 'raja.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    query: {
        raw: true
    }
});
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});


const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

Course.hasMany(Student, { foreignKey: 'courseId' });
Student.belongsTo(Course, { foreignKey: 'courseId' });

module.exports.initialize = function () {
    return sequelize.sync().then(function () {
        console.log("Database synced");
    }).catch(function (error) {
        throw error;
    });
};

module.exports.getAllStudents = function () {
    return Student.findAll().then(function (students) {
        return students;
    }).catch(function (error) {
        throw error;
    });
};

module.exports.getStudentsByCourse = function (course) {
    return Student.findAll({
        where: { courseId: course }
    }).then(function (students) {
        return students;
    }).catch(function (error) {
        throw error;
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        }).then((data) => {
            if (data.length > 0) {
                resolve(data[0]); 
            } else {
                reject("No results returned"); 
            }
        }).catch((error) => {
            reject("No results returned"); 
        });
    });
};


module.exports.getCourses = function () {
    return Course.findAll().then(function (courses) {
        if(courses.length > 0) {
            return courses;
        } else {
            return Promise.reject("no results returned");
        }
    }).catch(function (error) {
        return Promise.reject("no results returned");
    });
};

module.exports.getCourseById = function (id) {
    return Course.findByPk(id).then(function (course) {
        if(course) {
            return course;
        } else {
            return Promise.reject("no results returned");
        }
    }).catch(function (error) {
        return Promise.reject("no results returned");
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {

        studentData.TA = (studentData.TA) ? true : false;
        
        for (let prop in studentData) {
            if (studentData[prop] === "") {
                studentData[prop] = null;
            }
        }

        Student.create(studentData)
            .then(() => resolve("Operation was a success"))
            .catch((error) => reject("Unable to create student"));
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = (studentData.TA) ? true : false;
        
        for (let prop in studentData) {
            if (studentData[prop] === "") {
                studentData[prop] = null;
            }
        }

        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then(() => resolve("Operation was a success"))
            .catch((error) => reject("Unable to update student"));
    });
};

module.exports.addCourse = function (courseData) {
    Object.keys(courseData).forEach(key => courseData[key] = courseData[key] === "" ? null : courseData[key]);
    
    return Course.create(courseData).then((course) => {
        return course;
    }).catch((error) => {
        return Promise.reject("unable to create course");
    });
};

module.exports.updateCourse = function (courseData) {
    Object.keys(courseData).forEach(key => courseData[key] = courseData[key] === "" ? null : courseData[key]);

    return Course.update(courseData, {
        where: { courseId: courseData.courseId }
    }).then(() => {
        return;
    }).catch((error) => {
        return Promise.reject("unable to update course");
    });
};

module.exports.deleteCourseById = function (id) {
    return Course.destroy({
        where: { courseId: id }
    }).then(() => {
        return;
    }).catch((error) => {

        return Promise.reject("unable to delete course");
    });
};

module.exports.deleteStudentByNum = function(studentNum) {
    return Student.destroy({
        where: { studentNum: studentNum }
    }).then(() => {
        return;
    }).catch((error) => {
        return Promise.reject("unable to delete student");
    });
};