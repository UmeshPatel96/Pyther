const { MongoClient, ObjectId } = require('mongodb');
var Students = require('../schema/student-schema');
var service = {};
var dbName = 'nodejs';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// service.getstudent = async function() {
//     return { result: "success" , data: await Students.find()}
//   }

const calculateTotalMarks = (student) => {
    return student.maths + student.science + student.english;
};

const calculatePercentage = (totalMarks) => {
    return ((totalMarks / 300) * 100).toFixed(2);
};

const rankStudents = (students) => {
    students.sort((a, b) => b.total - a.total);

    let currentRank = 1;
    for (let i = 0; i < students.length; i++) {
        if (i > 0 && students[i].total === students[i - 1].total) {
            students[i].rank = students[i - 1].rank;
        } else {
            students[i].rank = currentRank;
        }
        currentRank += (i < students.length - 1 && students[i].total === students[i + 1].total) ? 0 : 1;
    }
};

const addProperties = (students) => {
    students.forEach((student) => {
        student.total = calculateTotalMarks(student);
        student.percentage = calculatePercentage(student.total);
    });

    rankStudents(students);
};

service.getstudent = async function (page, limit) {
    const allStudents = await Students.find();
    addProperties(allStudents);
    
    const totalStudents = allStudents.length;
    const skip = (page - 1) * limit;
    const paginatedStudents = allStudents.slice(skip, skip + limit);
    
    return {
        result: "success",
        data: paginatedStudents,
        totalPages: Math.ceil(totalStudents / limit),
        currentPage: page
    };
};

service.getstudentbyid = async function (id) {
    return await Students.findById(new ObjectId(id));
}

service.addstudent = async function (studentdata) {
    return { result: "success", data: await Students.create(studentdata) }
}

service.updatestudent = async function (id, studentdata) {
    return { result: "success", data: await Students.findByIdAndUpdate(new ObjectId(id), { $set: studentdata }, { new: true }) }
}

service.deletestudent = async function (id) {
    return { result: "success", data: await Students.findByIdAndDelete(new ObjectId(id)) }
}

service.searchstudent = async function (field, text) {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('students');
    const students = await collection.find().toArray();
    addProperties(students);
    var tempList = [];

    for (var i = 0; i < students.length; i++) {
        if (students[i][field].toString().toLowerCase().startsWith(text.toLowerCase())) {
            tempList.push(students[i]);
        }
    }
    return tempList;
};




module.exports = service;
