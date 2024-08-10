

var employeesList = [
	{ id: 1, name: 'Vivek', email: 'vivek@abc.com', phone: '2356422433', address: 'India' },
	{ id: 2, name: 'Pratistha', email: 'pari@abc.com', phone: '28896422433', address: 'India' },
];

const getCustomers = function () {
	return employeesList;
}

const getCustomerById = function (id) {
	var customer = {};
	for (var i = 0; i < employeesList.length; i++) {
		if (employeesList[i].id == id) {
			return employeesList[i];
		}
	}
	return customer;
}

const addCustomer = function (customer) {
	//assignment
	customer.id = Date.now();
	employeesList.push(customer);
	return({ result: "success", msg: "customer added ok" });
}


const updateCustomer = function (customer) {

	for (var i = 0; i < employeesList.length; i++) {
		if (employeesList[i].id == customer.id) {
			employeesList[i] = customer;
			break;
		}
	}
	return({ result: "success", msg: "Customer updated successfully", customer: employeesList[i] });
}
const deleteCustomer = function (id) {
	//assignment
	var templist = [];
	for (var i = 0; i < employeesList.length; i++) {
		if (employeesList[i].id != id) {
			templist.push(employeesList[i]);
		}
	}
	employeesList = templist;
	return({ result: "success", msg: "customer deleted ok" });


}

const searchCustomer = function(field, text) {
    var tempList = [];
    for (var i = 0; i < employeesList.length; i++) {
        if (field === 'id') {
            // Special handling for id field (numeric comparison)
            if (employeesList[i][field] == text) {
                tempList.push(employeesList[i]);
            }
        } else {
            // Handling for other fields (string comparison)
            if (employeesList[i][field].toLowerCase().startsWith(text.toLowerCase())) {
                tempList.push(employeesList[i]);
            }
        }
    }
    return tempList;
}


		module.exports = { getCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer, searchCustomer };
