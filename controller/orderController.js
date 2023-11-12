import {Order} from "../model/order.js";
import {customers} from "../db/db_arrays.js";
import {items} from "../db/db_arrays.js";
import {orders} from "../db/db_arrays.js";
import {Item} from "../model/item.js";
import {Customer} from "../model/customer.js";

let cusRowIndex = null;
let itemRowIndex = null;
let total = 0;
let subTotal = 0;
let item = null;
let tempItems = [];
let addedItems = [];

customers.push(new Customer("C001" , "Ishan" , "Agal Oya" , 1000000));
customers.push(new Customer("C002" , "Ishan" , "Agal Oya" , 1000000));
customers.push(new Customer("C003" , "Ishan" , "Agal Oya" , 1000000));

items.push(new Item("I001" , "abc" , 100 , 10));
items.push(new Item("I002" , "abc" , 150 , 20));
items.push(new Item("I003" , "abc" , 200 , 30));

const loadAddItemTable = ()=>{
    $("#order_item_table > tbody").html("");
    addedItems.map((item) => {
        $("#order_item_table > tbody").append(`
                    <tr>
                        <td> ${item.id} </td>
                        <td> ${item.name} </td>
                        <td> ${item.price} </td>
                        <td> ${item.qty} </td>
                    </tr>
    `   );
    })
}

// set current date
function currentDate() {
    let currentDate = new Date();
    var dd = String(currentDate.getDate()).padStart(2, '0');
    var mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = currentDate.getFullYear();

    currentDate = yyyy + '-' + mm + '-' + dd;

    $("").val(currentDate);

}

const loadIdDate = () =>{
    if(customers.length == 0){
        $("#orderId").val("OD001");
    }else{
        // $("#orderId").val(generateNewId(orders[orders.length - 1].id));
    }

    $("#date").val(new Date().toLocaleDateString('en-GB'));
};
loadIdDate();

//loadCustomers
$(".order").on('click', ()=>{
    $("#orderCusId").html("");
    customers.map((customer) => {
        $('#orderCusId').append($('<option>', {
            value: customer.id,
            text: customer.id
        }));
    });
    $("#orderCusId").val("");
});

//setCustomerDetails
$("#customerSelector").on('click','select', function (){
    cusRowIndex = customers.findIndex(customer => customer.id === $(this).val());
    if(cusRowIndex == -1) return;
    $("#orderCusName").val( customers[cusRowIndex].name );
    $("#orderCusAddress").val( customers[cusRowIndex].address );
    $("#orderCusSalary").val( customers[cusRowIndex].salary );
});

//loadItems
$(".order").on('click', ()=> {
    $("#orderItemId").html("");
    items.map((item) => {
        $('#orderItemId').append($('<option>', {
            value: item.id,
            text: item.id
        }));
    });
    $("#orderItemId").val("");
});

//setItemDetails
$("#itemSelector").on('click','select', function (){
    itemRowIndex = items.findIndex(item => item.id === $(this).val());
    if(itemRowIndex == -1) return;
    $("#orderItemName").val( items[itemRowIndex].name );
    $("#orderItemPrice").val( items[itemRowIndex].price );
    $("#qty-on-hand").val( items[itemRowIndex].qty );
});

//load Item details
$("#orderItemId").on( 'change' , function () {
    itemRowIndex = items.findIndex(item => item.id === $(this).val());
    console.log(itemRowIndex);
    if(itemRowIndex == null) return;
    $("#orderItemName").val( items[itemRowIndex].name );
    // $("#orderItemPrice").val( items[itemRowIndex].price );
    $("#qtyOnHand").val( items[itemRowIndex].qty );

    item = items[itemRowIndex];

});

//add-item action
$("#add-item-btn").on('click', ()=>{
    let id = item.id,
        name = item.name,
        price = Number.parseFloat(item.price),
        qty = Number.parseInt($("#quantity").val()),
        itemTotal = price * qty;

    if(qty > items[itemRowIndex].qty || !qty) {
        showErrorAlert("Please enter a valid qty..Need to be lower than or equal to qty on hand");
        return;
    }

    let existingItem = addedItems.findIndex(item => item.id === id);
    console.log("index : " + existingItem);

    if(existingItem < 0){
        addedItems.push(new Item(id, name, price, qty, itemTotal));
    }else {
        addedItems[existingItem].qty += qty;
    }
    loadAddItemTable();

    tempItems.push(items[itemRowIndex]);
    items[itemRowIndex].qty -= qty;
    $("#qtyOnHand").val( items[itemRowIndex].qty );

    subTotal += itemTotal;
    $("#subTotal").text(`Sub Total: Rs. ${subTotal}`);

    loadAddItemTable()
});

//show balance
$("#cash").on('input', ()=>{
    console.log(Number.parseFloat($("#cash").val()));
    console.log(Number.parseFloat($("#subTotal").text().slice(15)));
    $("#balance").val(Number.parseFloat($("#cash").val()) - Number.parseFloat($("#subTotal").text().slice(15)));
})

//save order
$("#order-btn").on('click', ()=>{
    console.log("ordered");

    let orderId = $("#orderId").val(),
        date = $("#date").val(),
        customer = $("#orderCusId").val(),
        items = addedItems,
        total = Number.parseFloat($("#subTotal").text().slice(15)),
        discount = Number.parseFloat($("#discount").val());

    if(checkValidation(orderId, date, customer, items, total, discount)){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Place Order!'
        }).then((result) => {
            if (result.isConfirmed) {

                let order = new Order(orderId, date, customer, items, discount, total);
                orders.push(order);

                console.log(order);

                $("balance").val(Number.parseFloat($("#cash").val()) - total);

                $("#order-section form").trigger('reset');
                $("select").val("");
                loadIdDate();
                addedItems = [];
                loadAddItemTable();
                Swal.fire(
                    `Rs: ${total}`,
                    'The Order has been placed!',
                    'success'
                )
            }
        })
    }
});

//cancel order
$("#cancel-order-btn").on('click', ()=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Cancel the order!'
    }).then((result) => {
        if (result.isConfirmed) {

            addedItems.map((addedItem) =>{
                let i = items.findIndex(item => item.id === addedItem.id);
                items[i].qty += addedItem.qty;
            });

            $("#order-section form").trigger('reset');
            $("select").val("");;
            $("#subTotal").text('Sub Total: Rs. 0000.00');
            addedItems = [];
            loadAddItemTable();

            Swal.fire(
                `Canceled`,
                'The Order has been canceled!',
                'success'
            )
        }
    })
})

//check validations
function checkValidation(orderId, date, customer, items, total, discount) {
    if(!customer){
        showErrorAlert("Please select a customer to place order");
        return false;
    }
    if(items.length == 0){
        showErrorAlert("Please select a item/items to place order");
        return false;
    }
    if(!$("#cash").val()){
        showErrorAlert("Please enter the cash amount");
        return false;
    }
    if((Number.parseFloat($("#cash").val()) - total) < 0){
        showErrorAlert("The cash is not enough to pay the order!!!");
        return false;
    }
    return true;
}

//generateNewID
function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(2), 10);
    const newNumber = lastNumber + 1;
    const newId = "OD" + newNumber.toString().padStart(3, "0");
    return newId;
}

//showErrorAlert
function showErrorAlert(message){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}