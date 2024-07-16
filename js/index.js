
/// <reference types="../@types/jquery"/>

let customers;
let transactions;
let currentFetchedData;
async function getCustomers(dataName) 
{

    const url = `http://localhost:3000/${dataName}`;

    try {
        const response = await fetch(url);
        currentFetchedData = await response.json();
        return currentFetchedData;
        
    } catch (error) {
        console.error(error);
    }
    
}

async function searchByCustomer(name) 
{

    let cartoona = ``;
    for (let i = 0; i < customers.length; i++) 
    {
        if(customers[i].name.toLowerCase().includes(name.value.toLowerCase()) )
        {
            cartoona += `<div class="col-lg-3 d-flex justify-content-center align-items-center">
                        <div class="card mt-5 text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title h3 fw-bold text-capitalize">${customers[i].name}</h5>
                            <div class="buttons mt-4">
                            <a  class="btn btn-success tran">Transactions</a>
                            <a  class="btn btn-danger graph">Graph</a>
                            </div>
                        </div>
                        </div>
                    </div>`;     
        }
        
    }
    $('.customers').html(cartoona);
    displayTransactions(customers,transactions);
    
}

async function searchByTransactions(amount) 
{
    if(amount.value == '')
    {
        displayCustomers();
        return;
    }
    
    let cartoona = ``;
    let ids = [];
    for (let i = 0; i < customers.length; i++) 
    {
        let id = customers[i].id;
        for (let j = 0; j < transactions.length; j++) 
        {

            if(transactions[j].customer_id == id)
            {
                

                if(transactions[j].amount == amount.value && !ids.includes(id))
                {
                    cartoona += `<div class="col-lg-3 d-flex justify-content-center align-items-center">
                        <div class="card mt-5 text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title h3 fw-bold text-capitalize">${customers[i].name}</h5>
                            <div class="buttons mt-4">
                            <a  class="btn btn-success tran">Transactions</a>
                            <a  class="btn btn-danger graph">Graph</a>
                            </div>
                        </div>
                        </div>
                    </div>`;    
                    ids.push(id); 
                }
                
            }
            
        }
        
    }
    
    $('.customers').html(cartoona);
    console.log($('.customers'));
    displayTransactions(customers,transactions);
    
}




async function displayTable(customers,transactions) 
{

    
    let cartoona = ``;
    for (let i = 0; i < transactions.length; i++) 
    {
        cartoona += `<tr>
        <td class="pt-3 pb-3">${i+1}</td>
        <td class="pt-3 pb-3" >${customers.name}</td>
        <td class="pt-3 pb-3">${transactions[i].date}</td>
        <td class="pt-3 pb-3">${transactions[i].amount}</td>
        
        </tr>`;     
    }
    
    $('#tableContent').html(cartoona);
    $('.option-title').html('transactions')
    
    if($('.tb').hasClass('d-none')) 
    {
        $('.tb').removeClass('d-none');
    }
    if($('.tb .table').hasClass('d-none')) 
    {
        $('.tb .table').removeClass('d-none');
    }
    if(!$('.body').hasClass('overflow-hidden')) 
    {
        $('.body').addClass('overflow-hidden');
    }
    if(!$('#myChart').hasClass('d-none'))
    {
        $('#myChart').addClass('d-none');
    }

}

async function displayGraph(transactions) 
{
    const xValues = [];
    const yValues = [];

    for (let i = 0; i < transactions.length; i++)
    {
        const date = new Date(transactions[i].date);
        const dayOfMonth = date.getDate();
        xValues.push(dayOfMonth);
        yValues.push(transactions[i].amount);
        
    }
    
    console.log(xValues);
    console.log(yValues);
    
    

    new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: yValues
        }]
    },
    options: {
        legend: {display: false},
        scales: {
        yAxes: [{ticks: {min: 200, max:3200}}],
        }
    }
    });
    

    $('.option-title').html('Graph')
    if($('.tb').hasClass('d-none')) 
    {
        $('.tb').removeClass('d-none');
    }
    if(!$('.tb .table').hasClass('d-none')) 
    {
        $('.tb .table').addClass('d-none');
    }
    if(!$('.body').hasClass('overflow-hidden')) 
    {
        $('.body').addClass('overflow-hidden');
    }
    if($('#myChart').hasClass('d-none'))
    {
        $('#myChart').removeClass('d-none');
    }

}




async function displayTransactions(customers,transactions)
{
    let tranButton = document.querySelectorAll('.card .tran');
    let graphButton = document.querySelectorAll('.card .graph');
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        tranButton[i].addEventListener('click', async function(e) 
        {
            
            let name = cards[i].children[0].children[0].textContent;
            for (let j = 0; j < customers.length; j++) 
            {
                if(customers[j].name == name) 
                {
                    let id = customers[j].id;
                    let tran = [];
                    for (let z = 0; z < transactions.length; z++) 
                    {
                        
                        if(id == transactions[z].customer_id)
                        {
                            tran.push(transactions[z]);
                        }
                        
                    }
                    await displayTable(customers[j],tran);
                    break;
                }
            }
        });
        graphButton[i].addEventListener('click', async function(e) 
        {
            let name = cards[i].children[0].children[0].textContent;
            for (let j = 0; j < customers.length; j++) 
            {
                if(customers[j].name == name) 
                {
                    let id = customers[j].id;
                    let tran = [];
                    for (let z = 0; z < transactions.length; z++) 
                    {
                        
                        if(id == transactions[z].customer_id)
                        {
                            tran.push(transactions[z]);
                        }
                        
                    }
                    await displayGraph(tran);
                    break;
                }
            }
        });
    }
}

async function displayCustomers() 
{
    

    customers = await getCustomers('customers');
    transactions = await getCustomers('transactions');
    let cartoona = ``;
    for (let i = 0; i < customers.length; i++) 
    {
        cartoona += `<div class="col-lg-3 d-flex justify-content-center align-items-center">
                    <div class="card mt-5 text-center" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title h3 fw-bold text-capitalize">${customers[i].name}</h5>
                        <div class="buttons mt-4">
                        <a  class="btn btn-success tran">Transactions</a>
                        <a  class="btn btn-danger graph">Graph</a>
                        </div>
                    </div>
                    </div>
                </div>`;     
    }
    
    $('.customers').html(cartoona);

    if(!$('.spinner').hasClass('d-none')) 
    {
        $('.spinner').addClass('d-none');
    }
    displayTransactions(customers,transactions);

}

$('.title2 i').on('click',function()
{
    $('.tb').addClass('d-none');
    $('.body').removeClass('overflow-hidden');
});

displayCustomers();