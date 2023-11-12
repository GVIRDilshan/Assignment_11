import {Customer} from "../model/customer.js";
import {customers} from "../db/db_arrays.js";

let row_index = null;

const loadId = () =>{
    if(customers.length == 0){
        $("#cusId").val("C001");
    }else{
        $("#cusId").val(generateNewId(customers[customers.length - 1].id));
    }
};
loadId();

const loadCustomerTable = () => {
    $("#cusTable").html("");
    customers.map((customer) => {
        $("#cusTable").append(`<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`);
    });
};

$(".customer").on('click', ()=> loadCustomerTable());

// search bar action
$("#customer_search_btn").on('click', function () {
    let temp_customer_index = customers.findIndex(customer => customer.id == $("#customer_search_bar").val());
    let temp_customer = customers[temp_customer_index];

    if (temp_customer != null ) {
       $("#cusId").val(temp_customer.id);
       $("#cusName").val(temp_customer.name);
       $("#cusAddress").val(temp_customer.address);
       $("#cusSalary").val(temp_customer.salary);

       row_index = temp_customer_index;

    } else {
        Swal.fire({
            icon: 'question',
            title: "Can't find customer !",
            text: "Search another customer ID"
        });
    }

});

//save
$("#cus-save").on('click', () => {
    let id = $("#cusId").val(),
        name = $("#cusName").val(),
        address = $("#cusAddress").val(),
        salary = Number.parseFloat($("#cusSalary").val());

    if(!checkValidation(id, name, address, salary)) return;

    let customer = new Customer(id, name, address, salary);
    customers.push(customer);

    loadCustomerTable();
    $("#cus-reset").click();
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Customer has been saved',
        showConfirmButton: false,
        timer: 1500
    });
});

//search
$("#cusTable").on('click', "tr", function(){
    let selectedId = $(this).find("td:nth-child(1)").text();

    $("#cusId").val(selectedId);
    $("#cusName").val($(this).find("td:nth-child(2)").text());
    $("#cusAddress").val($(this).find("td:nth-child(3)").text());
    $("#cusSalary").val(Number.parseFloat($(this).find("td:nth-child(4)").text()));

    row_index = customers.findIndex((customer => customer.id == selectedId));
});

//update
$("#cus-update").on('click', () => {
    let id = $("#cusId").val(),
        name = $("#cusName").val(),
        address = $("#cusAddress").val(),
        salary = Number.parseFloat($("#cusSalary").val());

    if(!checkValidation(id, name, address, salary)) return;

    customers[row_index].id = id;
    customers[row_index].name = name;
    customers[row_index].address = address;
    customers[row_index].salary = salary;

    loadCustomerTable();

    $("#cus-reset").click();
    loadId();
    row_index = null;
    Swal.fire({
        icon: 'success',
        title: 'Customer has been updated',
        showConfirmButton: false,
        timer: 1500
    })
});

//remove
$("#cus-delete").on('click', () => {
    if (row_index == null) return;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete customer!'
    }).then((result) => {
        if (result.isConfirmed) {
            customers.splice(row_index, 1);
            loadCustomerTable();
            $("#cus-reset").click();
            loadId();
            Swal.fire(
                'Deleted!',
                'Customer has been deleted.',
                'success'
            )
        }
    })
});

//validation
function checkValidation(id, name, address, salary){
    console.log(id);
    if(!/^C\d{3}$/.test(id)){ //chekc ID
        showErrorAlert("Please enter a valid ID!")
        return false;
    }
    if(!name){ //check name
        showErrorAlert("Please enter a valid name!");
        return false;
    }
    if(!address){ //check address
        showErrorAlert("Please enter a valid address!");
        return false;
    }
    if(!/^\d+(\.\d{1,2})?$/.test(salary.toString())){ //check salary
        showErrorAlert("Please enter a valid salary");
        return false;
    }
    return true;
}

//showErrorAlert
function showErrorAlert(message){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

//generateNewID
function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(1), 10);
    const newNumber = lastNumber + 1;
    const newId = "C" + newNumber.toString().padStart(3, "0");
    return newId;
}

$("#cus-reset").on('click', ()=>{
    setTimeout(loadId, 10);
})
