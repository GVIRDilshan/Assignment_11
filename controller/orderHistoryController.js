import {orders} from "../db/db_arrays.js";

const loadtTable = () =>{
    $("#order-history-section tbody").html("");
    orders.map(order => {
        $("#order-history-section tbody").append(`
            <tr>
                <td>${order.id}</td>
                <td> ${order.date} </td>
                <td> ${order.customer} </td>
                <td> <i class="fa-solid fa-circle-info"></i> ${order.items.length}  </td>
                <td> ${order.discount} </td>
                <td> ${order.total} </td>
            </tr>
        `);
    });
};

$(".order-history").on('click', ()=>{
    loadtTable();

})

//table row action
$("#order-history-section tbody").on('click', 'tr', function (){
    let selectedId = $(this).find("td:nth-child(1)").text();
    console.log(selectedId);

    let index = orders.findIndex(order => order.id === selectedId);
    console.log(index);

    if(index == -1) return;

    let details = "";
    orders[index].items.map((item) => {
        details += item.id + " - " + item.name + "\n";
    });

    Swal.fire(details);
});