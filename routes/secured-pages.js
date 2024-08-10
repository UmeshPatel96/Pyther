var express = require('express');
var router = express.Router();
var customerService = require('../service/customer-service');
var customerMysql = require('../service/customer-mysql');
var customermongo = require('../service/customer-mongo');
var studentsmongo = require('../service/student-mongo');
const { routes } = require('../app');



router.get('/dashboard', function(req, res, next) {
    res.render('index', { title: 'Dashboard', name:req.session.user });
  });
  
  router.get('/about', function(req, res, next) {
    res.render('index', { title: 'About',name:req.session.user });
  });
  
//   router.get('/customer', async (req, res, next) => {
//     let customer = await customermongo.getCustomers();
//     res.render('customer', { title: 'Customers', data:customer,name:req.session.user });
//   });
  
router.get('/customer', (req, res, next) => {
    var callback = function(customer){
      res.render('customer', { title: 'Customers',data:customer,name:req.session.user});
    }
    customermongo.getCustomers().then(callback);
  });
  router.get('/customer/edit/:id', async(req, res, next) => {
    var customer =  await customermongo.getCustomersById(req.params.id);
    res.render('customer-edit', { title: 'customer', customer:customer,name:req.session.user});
  });

// router.get('/customer/edit/:id', (req, res, next) => {
//     var callback = function(customer){
//     res.render('customer-edit', { title: 'customer', customer:customer,name:req.session.user});
//   }
//   customermongo.getCustomersById(req.params.id).then(callback);
//   });

  router.get('/customer/add', (req, res, next) => {
    res.render('customer-add', { title: 'customer',name:req.session.user });
  });
  
  router.get('/customer/:searchTxt', async(req, res, next) => {
    var customer = await customermongo.searchCustomer(req.params.searchTxt);
    res.render('customer', { title: 'Customers', data:customer,name:req.session.user});
  });




  /////////////////////////////////////////////////////////////////////////////////////////
  //student

//   router.get('/student', async (req, res, next) => {
//     const students = await studentsmongo.getstudent();
//     const data = students.data;

//     // Calculate total scores and sort by total score in descending order
//     data.forEach(student => {
//         student.total = student.maths + student.science + student.english;
//     });
//     data.sort((a, b) => b.total - a.total);

//     // Assign ranks based on sorted order
//     let rank = 1;
//     for (let i = 0; i < data.length; i++) {
//       if (i > 0 && data[i].total < data[i - 1].total) {
//           rank = i + 1;
//       }
//       data[i].rank = rank;
//   }

//     res.render('student', { title: 'Student', sort: "normal",  data: data, name: req.session.user });
// });
router.get('/student', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const studentsResult = await studentsmongo.getstudent(page, limit);
  const { data, totalPages, currentPage } = studentsResult;

  res.render('student', {
      title: 'Student',
      sort: "normal",
      data: data,
      totalPages: totalPages,
      currentPage: currentPage,
      name: req.session.user
  });
});


router.get('/student/add', (req, res, next) => {
    res.render('student-add', { title: 'Student Add', name: req.session.user });
});

router.get('/student/edit/:id', async (req, res, next) => {
  const student = await studentsmongo.getstudentbyid(req.params.id);
  res.render('student-edit', { title: 'Student Edit', student: student, name: req.session.user });
});

router.get('/student/:field/:searchTxt', async (req, res, next) => {
  const { field, searchTxt } = req.params;
  var students = await studentsmongo.searchstudent(field, searchTxt);

  res.render('student', {
      title: 'Students',
      sort: "normal",
      totalPages: "totalPages",
      currentPage: "currentPage",
      data: students,
      name: req.session.user
  });
});

router.get('/student/sort/:field/:order', async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 5;
  let students = await studentsmongo.getstudent(page,limit);
  const data = students.data;
  const { field, order } = req.params;
  if (order === 'normal') {
  } else {
      // Apply sorting if order is 'asc' or 'desc'
      const sortOrder = order === 'asc' ? 1 : -1;
            data.sort((a, b) => {
                if (a[field] < b[field]) {
                    return -1 * sortOrder;
                }
                if (a[field] > b[field]) {
                    return 1 * sortOrder;
                }
                return 0;
      });
  }
  let nextOrder = 'asc';
  if (order === 'asc') {
      nextOrder = 'asc';  
  } else if (order === 'desc') {
      nextOrder = 'desc'; // or 'asc' based on how you want to handle it
      } else {
      nextOrder = 'normal'; // default sort
  }

  res.render('student', { 
    title: 'Students', 
    sort: nextOrder, 
    data: data, 
    totalPages: students.totalPages, 
    currentPage: students.currentPage, 
    name: req.session.user 
  });
});
  module.exports = router;
  