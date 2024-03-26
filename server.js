/**********************************************************************************
 *  WEB700 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 * 
 * Name: Naghmeh Karami Student ID: nkarami5 Date: 25/3/2024*
 * Online (Cyclic) Link: I cant deply in cyclic. I get the error shown in the video.
 * I also can not login to my heroku account anymore and therefore I was not able to deploy it to heroku either
 * *********************************************************************************/
// Import required modules
const express = require("express");
const exphbs = require('express-handlebars');
const app = express();
const path = require("path");
const collegeData = require("./modules/collegeData");

// Define PORT
const PORT = process.env.PORT || 3000;

// Setup static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Setup Handlebars engine
const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        navLink: function(url, options) {
            return '<li' + ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

// Set Handlebars as the view engine
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Middleware to set activeRoute
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// Initialize collegeData before starting the server
collegeData.initialize().then(() => {
    // Setup http server to listen on PORT
    app.listen(PORT, () => { 
        console.log(`Server listening on: ${PORT}`);
    });
}).catch(err => {
    console.log(err);
});

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

app.get('/students/add', (req, res) => {
    res.render('addStudent');
});

app.post('/students/add', (req, res) => {
    req.body.TA = req.body.TA ? true : false;
    collegeData.addStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch(err => {
        console.log(err);
        res.status(500).send("Failed to add student");
    });
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then((data) => {
            res.render("students", { students: data });
        }).catch((err) => {
            res.render("students", { message: "no results" });
        });
    } else {
        collegeData.getAllStudents().then((data) => {
            res.render("students", { students: data });
        }).catch((err) => {
            res.render("students", { message: "no results" });
        });
    }
});

app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
        if (data.length === 0) {
            res.render("courses", { message: "no results" });
        } else {
            res.render("courses", { courses: data });
        }
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving courses");
    });
});

// GET route to render the form for updating student information
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num).then((student) => {
        res.render("student", { student: student });
    }).catch((err) => {
        console.error(err);
        res.status(404).send("Student not found");
    });
});

// POST route to update student information
app.post("/student/update", (req, res) => {
    console.log(req.body);
    // Update student information using collegeData.updateStudent method
    // Redirect to students list page after updating
    res.redirect("/students");
});


// No matching route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
