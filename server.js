/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ma Czarina Alexandria Navarrete Student ID: 126846237/mcanavarrete Date: February 17, 2024
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var collegeData = require("./modules/collegeData");

app.use(express.static('views'));
app.use(express.static('images'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 

// Initialize collegeData before starting the server
collegeData.initialize().then(() => {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, () => { 
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch(err => {
    console.log(err);
});

// GET /
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// GET /about
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// GET /htmlDemo
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

// GET /students/add
app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

// POST /students/add
app.post('/students/add', (req, res) => {
    // Convert checkbox value to boolean
    req.body.ta = req.body.ta ? true : false;
    collegeData.addStudent(req.body).then(() => {
        res.redirect("/students");
    }).catch(err => {
        console.log(err);
        res.status(500).send("Failed to add student");
    });
});

// GET /students
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({message: "no results"});
        });
    } else {
        collegeData.getAllStudents().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({message: "no results"});
        });
    }
});

// GET /tas
app.get("/tas", (req, res) => {
    collegeData.getTAs().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({message: "no results"});
    });
});

// GET /courses
app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({message: "no results"});
    });
});

// GET /student/:num
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({message: "no results"});
    });
});

// No matching route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
