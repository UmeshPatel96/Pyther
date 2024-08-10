const Customer = require('../schema/customer-model');
const bcrypt = require('bcrypt');
const csvParser = require('csv-parser');
const { Parser } = require('json2csv');
const xlsx = require('xlsx');
const fs = require('fs');

// Define the service object
const service = {};

// Get customer by ID
service.getCustomersById = async function (id) {
    try {
        const customer = await Customer.findById(id).select('-password');
        return { result: "success", data: customer };
    } catch (error) {
        console.error('Error getting customer by ID:', error);
        return { result: "error", msg: "Error Getting By ID", error: error.message };
    }
};

// Add a new customer
service.addCustomer = async function (customerData) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(customerData.password, salt);
        customerData.password = hashedPassword;

        const customer = new Customer(customerData);
        await customer.save();
        return { result: "success", msg: "Added Successfully", data: customer };
    } catch (error) {
        console.error('Error adding customer:', error);
        return { result: "error", msg: "Error Adding", error: error.message };
    }
};

// Update customer details
service.updateCustomer = async function (id, customerData) {
    try {
        await Customer.findByIdAndUpdate(id, customerData, { new: true }).exec();
        return { result: "success", msg: "Edited Successfully" };
    } catch (error) {
        console.error('Error updating customer:', error);
        return { result: "error", msg: "Error Updating", error: error.message };
    }
};

// Delete a customer
service.deleteCustomer = async function (id) {
    try {
        await Customer.findByIdAndDelete(id).exec();
        return { result: "success", msg: "Deleted Successfully" };
    } catch (error) {
        console.error('Error deleting customer:', error);
        return { result: "error", msg: "Error Deleting", error: error.message };
    }
};

// Search and sort customers
service.searchAndSortCustomers = async function (text, field, order, page, limit) {
    try {
        let query = {};
        if (text) {
            const regex = new RegExp(text, 'i');
            query = {
                $or: [
                    { name: regex },
                    { email: regex },
                    { phone: regex },
                    { address: regex },
                ]
            };
        }

        const totalCustomers = await Customer.countDocuments(query);
        const customers = await Customer.find(query).select('-password')
            .skip((page - 1) * limit)
            .limit(limit);

        // Sort the results
        if (order !== 'normal') {
            customers.sort((a, b) => {
                if (order === 'asc') {
                    return a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1;
                } else {
                    return a[field].toLowerCase() < b[field].toLowerCase() ? 1 : -1;
                }
            });
        }

        return {
            result: "success",
            data: customers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCustomers / limit),
                totalItems: totalCustomers,
            }
        };
    } catch (error) {
        console.error('Error searching and sorting customers:', error);
        return { result: "error", msg: "Error Searching and Sorting", error: error.message };
    }
};

// // Import CSV data
// service.importCSV = async function (filePath) {
//     try {
//         const results = [];
//         await new Promise((resolve, reject) => {
//             fs.createReadStream(filePath)
//                 .pipe(csvParser())
//                 .on('data', (data) => results.push(data))
//                 .on('end', async () => {
//                     await Customer.insertMany(results);
//                     resolve();
//                 })
//                 .on('error', reject);
//         });
//         return { result: "success", msg: "CSV data imported successfully" };
//     } catch (error) {
//         console.error('Error importing CSV:', error);
//         return { result: "error", msg: "Error importing CSV", error: error.message };
//     }
// };

// // Import Excel data
// service.importExcel = async function (filePath) {
//     try {
//         const workbook = xlsx.readFile(filePath);
//         const sheet_name_list = workbook.SheetNames;
//         const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
//         await Customer.insertMany(data);
//         return { result: "success", msg: "Excel data imported successfully" };
//     } catch (error) {
//         console.error('Error importing Excel:', error);
//         return { result: "error", msg: "Error importing Excel", error: error.message };
//     }
// };

// // Export data to CSV
// service.exportCSV = async function () {
//     try {
//         const customers = await Customer.find().lean();
//         const json2csvParser = new Parser();
//         const csv = json2csvParser.parse(customers);
//         return { result: "success", data: csv, filename: 'customers.csv' };
//     } catch (error) {
//         console.error('Error exporting CSV:', error);
//         return { result: "error", msg: "Error exporting CSV", error: error.message };
//     }
// };

// // Export data to Excel
// service.exportExcel = async function () {
//     try {
//         const customers = await Customer.find().lean();
//         const ws = xlsx.utils.json_to_sheet(customers);
//         const wb = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(wb, ws, 'Customers');
//         const filePath = 'customers.xlsx';
//         xlsx.writeFile(wb, filePath);
//         return { result: "success", filename: filePath };
//     } catch (error) {
//         console.error('Error exporting Excel:', error);
//         return { result: "error", msg: "Error exporting Excel", error: error.message };
//     }
// };

module.exports = service;
