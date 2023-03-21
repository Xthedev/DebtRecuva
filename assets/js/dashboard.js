const baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:EIOJ6OPN";

function fetchTotalCompany(){
    // select the id of the company tag
    var totalCompany = document.getElementById("Totalcompany");
    var totalDebtors = document.getElementById("Totaldebtors");
    var totalAgents = document.getElementById("Totalagents");
    // console.log(totalCompany);
    if(!totalCompany.innerHTML=="" || !totalDebtors.innerHTML=="" || !totalAgents.innerHTML==""){
         // CONNECTION 
        $.ajax({
            url: `${baseURL}/statistics/all`,
            type: 'GET',
            "headers": {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('access'),
            },
            "data": JSON.stringify({
                "totalcompanies": "string",
                "totaldebtors": "string",
                "totalagents": "string"
            }),
            success: function(response){
                // console.log('ajax.success');
                console.log(response);  
                if(response.error == "Unauthorized"){
                    swal(response.message,"");
                }else{
                    totalCompany.innerHTML=response.totalcompanies;
                    totalDebtors.innerHTML=response.totaldebtors;
                    totalAgents.innerHTML=response.totalagents;
                }
            },
            error: function(xhr, status) {
                // check if xhr.status is defined in $.ajax.statusCode
                // if true, return false to stop this function
                if(typeof this.statusCode[xhr.status] != 'undefined'){
                    return false;
                }
                // else continue
                console.log('ajax.error');
                console.log(xhr.responseJSON.message, "xhr");
                swal("",xhr.responseJSON.message);
            },
            statusCode: {
                    200: function(response) {
                        console.log('ajax.statusCode: 200');
                    },
                    401: function(response) {
                        console.log('ajax.statusCode: 401', response);
                    },
                    404: function(response) {
                        console.log('ajax.statusCode: 404');
                    },
                    500: function(response) {
                        console.log('ajax.statusCode: 500');
                        console.log(response, "500 response");
                        swal("",response.responseJSON.message);
                    }
                }           
            })
        // CONNECTION
  
    }
    else{
        totalCompany.innerHTML=0;
       
    }
}