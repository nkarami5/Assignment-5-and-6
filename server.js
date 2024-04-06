/**********************************************************************************
WEB700 – Assignment 06* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or* distributed to other students.*
* Name: Naghmeh Karami Student ID: nkarami5 Date: 6/4/2024*
* Online (Cyclic) Link: https://relieved-pumps-crow.cyclic.app
*********************************************************************************/
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const collegeData = require("./modules/collegeData.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }        
    }
}));

app.set('view engine', '.hbs');
app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});



app.get("/", (req, res) => {
    res.render("home");
});


app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});


app.get("/students", (req, res) => {
    function renderStudents(students) {
        if (students.length > 0) {
            res.render("students", { students: students });
        } else {
            res.render("students", { message: "No students found" });
        }
    }

    function handleError(error) {
        res.render("students", { message: "no results returned" });
    }
    

    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then(renderStudents).catch(handleError);
    } else {
        collegeData.getAllStudents().then(renderStudents).catch(handleError);
    }
});

app.get("/students/add", (req, res) => {
    collegeData.getCourses().then(courses => {
        console.log("Courses fetched: ", courses); 
        res.render("addStudent", { courses });
    }).catch(err => {
        console.error("Error fetching courses: ", err);
        res.render("addStudent", { courses: [] });
    });
});


app.post('/students/add', (req, res) => {
    req.body.ta = req.body.ta ? true : false;
    collegeData.addStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch(err => {
        console.log(err);
        res.status(500).send("Failed to add student");
    });
});

app.get("/student/:studentNum", (req, res) => {
    let viewData = {};

    collegeData.getStudentByNum(req.params.studentNum).then((data) => {
        if (data) {
            viewData.student = data; 
        } else {
            viewData.student = null;
        }
    }).catch(() => {
        viewData.student = null; 
    }).then(collegeData.getCourses)
    .then((data) => {
        viewData.courses = data; 
        for (let i = 0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.courseId) {
                viewData.courses[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.courses = []; 
    }).then(() => {
        if (viewData.student == null) { 
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); 
        }
    });
});


app.post("/student/update", async (req, res) => {
    try {
        console.log(req.body); 
        
        await collegeData.updateStudent(req.body);

        res.redirect("/students");
    } catch (error) {
        console.error(error);
        res.status(500).send("Unable to update student information.");
    }
});

app.get("/student/delete/:studentNum", (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum).then(() => {
        res.redirect("/students");
    }).catch(err => {
        console.log(err);
        res.status(500).send("Unable to Remove Student / Student not found");
    });
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then(data => {
        if (data.length > 0) {
            res.render("courses", { courses: data });
        } else {
            res.render("courses", { message: "No courses found" });
        }
    }).catch(err => {
        res.render("courses", { message: "no results returned" });
    });
});

app.get("/courses/add", (req, res) => {
    console.log("Accessing /courses/add");
    res.render("addCourse");
});


app.post('/courses/add', (req, res) => {
    collegeData.addCourse(req.body).then(() => {
        res.redirect("/courses");
    }).catch(err => {
        console.log(err);
        res.status(500).send("Unable to add course");
    });
});

app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id).then(data => {
        console.log(data); 
        res.render("course", { course: data });
    }).catch(err => {
        console.log(err);
        res.status(404).send("Course not found");
    });
});

app.post('/course/update', (req, res) => {
    collegeData.updateCourse(req.body).then(() => {
        res.redirect("/courses");
    }).catch(err => {
        console.log(err);
        res.status(500).send("Unable to update course");
    });
});

app.get("/course/update/:id", (req, res) => {
    collegeData.getCourseById(req.params.id).then((courseData) => {
        res.render("updateCourse", { course: courseData });
    }).catch(err => {
        console.log(err);
        res.status(404).send("Course not found");
    });
});

app.get("/course/delete/:id", (req, res) => {
    collegeData.deleteCourseById(req.params.id).then(() => {
        res.redirect("/courses");
    }).catch(err => {
        console.log(err);
        res.status(500).send("Unable to remove course / Course not found");
    });
});


collegeData.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});


