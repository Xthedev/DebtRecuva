const baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:EIOJ6OPN";
const loader = (contentArea = "", colspan = "") => {
  document.querySelector(contentArea).innerHTML = `<tr>
  <td colspan="${colspan}" class="text-center">
    <img src="/assets/img/loader.gif" alt=""/>
  </td>
  </tr>`
}


// RANDOM ID 
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
// RANDOM ID


/* -------------------------------------------------------------------------- */
/*                         ADD NEW DEBT PORTFOLIO                             */
/* -------------------------------------------------------------------------- */
function addNewDebtportfolio(){
  

    // selecting the input element and get its value 
    let accfullname = document.getElementById("accfullname");
    let accemail = document.getElementById("accemail");
    let accmobile = document.getElementById("accmobile");
    let daysinarrears = document.getElementById("daysinarrears");
    let classification = document.getElementById("classification");
    let totaldue = document.getElementById("totaldue");
    let batchmonth = document.getElementById("batchmonth");
    let batchyear = document.getElementById("batchyear");

    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    
    if(!accfullname.value || !accemail.value || !accmobile.value || !daysinarrears.value || !classification.value || !totaldue.value || !batchmonth.value || !batchyear.value){
      swal("All fields are required");
      accfullname.focus();
      return false;
    }else if(!(accemail.value.match(mailformat))){
      swal("You have entered an invalid email address!");
      accemail.focus();
      return false;
    }else {
      // CONNECTION 
    //   loader('#allCompanies', 5),
      $.ajax({
        url: `${baseURL}/debtportfolio`,
        type: 'post',
        "headers": {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('access'),
        },
        "data": JSON.stringify({
            "debtportfolioid": "DEBT"+generateUUID(),
            "companyid": "COMPID"+generateUUID(),
            "accountfullname": accfullname.value,
            "accountemail": accemail.value,
            "accountmobile": accmobile.value,
            "daysinarrears": daysinarrears.value,
            "classification": classification.value,
            "totaldue": totaldue.value,
            "status": "string",
            "agentid": "AGTID"+generateUUID(),
            "batchmonth": batchmonth.value,
            "batchyear": batchyear.value
          }),
        success: function(response){
          // console.log('ajax.success');
          console.log(response);  
          if(response.error == "Unauthorized"){
            swal("",response.message,"warning");
          }else{
            swal("",response.message,"success");
            localStorage.setItem('access', response.authToken);
            setTimeout(()=>{
              location.assign('/pages/debt-portfolio.html');
            },2500)
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
            swal("",xhr.responseJSON.message,"error");
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
       
        
  };
/* -------------------------------------------------------------------------- */
/*                         ADD NEW DEBT PORTFOLIO                             */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                            FETCH DEBT PORTFOLIO                            */
/* -------------------------------------------------------------------------- */
function fecthDebtPortfolio(){
    loader('#allCompanies', 10);
  
      // CONNECTION 
      $.ajax({
      url: `${baseURL}/debtportfolio`,
      type: 'GET',
      "headers": {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('access'),
      },
      success: function(response){
          // console.log('ajax.success');
          console.log(response);  
          if(response.error == "Unauthorized"){
              swal("",response.message,"error");
          }else{
            // swal(response.message,"");
  
            // TABLE
            let thedata = response.data;
            // console.log(thedata.length);
            if (thedata.length > 0) {
              // $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>Company Found</h3></td></tr>");
  
              let rowContent;
              // Let's Start looping into the data coming from database
              $.each(thedata, (index, row) => {
  
            //     let userStatus, verificationStatus;
            //     if (row.user.status == 1) {
            //       userStatus = `<span class="text-success">Active</span>`;
            //     } else {
            //       userStatus = `<span class="text-danger">Inactive</span>`;
            //     }
  
            //     if (row.user.is_verified == 0) {
            //       verificationStatus = `<span class="text-danger">Not Verified</span>`;
            //     } else {
            //       verificationStatus = `<span class="text-success">Verified</span>`;
            //     }
  
                index = index + 1;
                rowContent += `
                  <tr>
                    <td class="">${row.accountfullname}</td>
                    <td class="">${row.accountemail}</td>
                    <td class="">${row.accountmobile}</td>
                    <td class="">${row.daysinarrears}</td>
                    <td class="">${row.classification}</td>
                    <td class="">${row.totaldue}</td>
                    <td class="">${row.id}</td>
                    <td class="">${row.batchmonth}</td>
                    <td class="">${row.batchyear}</td>
                    <td class="">
                        <div class="dropdown">
                            <button class="btn pt-0 pb-1 px-1" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="/assets/img/ellispe.png" alt="" width="20px">
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a class="dropdown-item" href="/pages/edit-debtors-profile.html?debt=${row.debtportfolioid}">Edit</a></li>
                                <li><a class="dropdown-item" href="javascript:void(0)" onclick="deleteSingleDebtPortfolio('${row.debtportfolioid}')">Delete</a></li>
                            </ul>
                        </div>
                    </td>
                </tr>
                `;
                $('#allCompanies').html(rowContent);
  
                // TABLE
                $(document).ready(function () {
                  $('#allTable').DataTable({
                    scrollY: 300,
                    scrollX: true,
                    scrollCollapse: true,
                    retrieve: true,
                    paging: true,
                    "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
                    fixedHeader: {
                      header: true,
                      footer: true
                    },
                    "language": {
                      "paginate": {
                        previous: '<',
                        next: '>'
                      }
                    }
                  });
                });
                // TABLE
              });
            } else {
              $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Debtportfolio added yet</h3></td></tr>");
            }
            // TABLE
  
  
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
          swal("",xhr.responseJSON.message,"error");
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

/* -------------------------------------------------------------------------- */
/*                          FETCH DEBT PORTFOLIO                              */
/* -------------------------------------------------------------------------- */





/* -------------------------------------------------------------------------- */
/*                           DELETE DEBT PORTFOLIO                            */
/* -------------------------------------------------------------------------- */
function deleteSingleDebtPortfolio(debtportfolio_id){

  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this data!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {

      // CONNECTION 
      $.ajax({
        url: `${baseURL}/debtportfolio/${debtportfolio_id}`,
        type: 'DELETE',
        "headers": {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('access')
        },
        success: function(response){
          // console.log('ajax.success');
          console.log(response);  
          if(response.error == "Unauthorized"){
            swal("",response.message,"error");
          }else{
            
            swal("Poof! Your imaginary file has been deleted!", {
              icon: "success",
            });
            fecthDebtPortfolio();

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
                    console.log(response, "500 response");
                    swal("",response.responseJSON.message);
                },
                500: function(response) {
                    console.log('ajax.statusCode: 500');
                }
            }           
      })
      // CONNECTION
    } else {
        swal("Your data is safe!");
    }
  });
  
}
/* -------------------------------------------------------------------------- */
/*                          DEELETE DEBT PORTFOLIO                            */
/* -------------------------------------------------------------------------- */





  /* -------------------------------------------------------------------------- */
  /*                       POPULATE DEBT PORTFOLIO DATA                         */
  /* -------------------------------------------------------------------------- */
  function getSingleDebtPortfolioData(){
    let debtportfolioid = location.href.split("debt=")[1];
    // alert(debtportfolioid);

    // CONNECTION 
    $.ajax({
    url: `${baseURL}/debtportfolio/${debtportfolioid}`,
    type: 'GET',
    "headers": {
        "Content-Type": "application/json",
        "authorization": localStorage.getItem('access'),
    },
    success: function(response){
        // console.log('ajax.success');
        // console.log(response);  
        if(response.error == "Unauthorized"){
            swal("",response.message,"error");
        }else{
          // swal(response.message,"");

          let thedata = response.data;
      

          console.log(thedata, "The Debt Portfolio Details");
          $('#companyid').val(thedata.companyid);
          $('#accfullname').val(thedata.accountfullname);
          $('#accemail').val(thedata.accountemail);
          $('#accmobile').val(thedata.accountmobile);
          $('#daysinarrears').val(thedata.daysinarrears);
          $('#classification').val(thedata.classification);
          $('#totaldue').val(thedata.totaldue);
          $('#batchmonth').val(thedata.batchmonth);
          $('#batchyear').val(thedata.batchyear);

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
        // console.log(xhr.responseJSON, "xhr");
        swal("",xhr.responseJSON.message,"error");
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
  /* -------------------------------------------------------------------------- */
  /*                       POPULATE DEBT PORTFOLIO DATA                         */
  /* -------------------------------------------------------------------------- */






  /* -------------------------------------------------------------------------- */
  /*                            EDIT DEBT PORTFOLIO                             */
  /* -------------------------------------------------------------------------- */
  function editDebtPortfolioRecord(){

    // Find current page
    // const activePage = window.location;
    let debtportfolioid = location.href.split("debt=")[1];
    // alert(debtportfolioid);
  
      // selecting the input element and get its value 
      let companyid = document.getElementById("companyid");
      let accfullname = document.getElementById("accfullname");
      let accemail = document.getElementById("accemail");
      let accmobile = document.getElementById("accmobile");
      let daysinarrears = document.getElementById("daysinarrears");
      let classification = document.getElementById("classification");
      let totaldue = document.getElementById("totaldue");
      let batchmonth = document.getElementById("batchmonth");
      let batchyear = document.getElementById("batchyear");
  
      var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
      
      if(!accfullname.value || !accemail.value || !accmobile.value || !daysinarrears.value || !classification.value || !totaldue.value || !batchmonth.value || !batchyear.value){
        swal("All fields are required");
        accfullname.focus();
        return false;
      }else if(!(accemail.value.match(mailformat))){
        swal("","You have entered an invalid email address!","error");
        accemail.focus();
        return false;
      }else {
        // CONNECTION 
        $.ajax({
          url: `${baseURL}/debtportfolio/${debtportfolioid}`,
          type: 'post',
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "companyid": companyid.value,
            "accountfullname": accfullname.value,
            "accountemail": accemail.value,
            "accountmobile": accmobile.value,
            "daysinarrears": daysinarrears.value,
            "classification": classification.value,
            "totaldue": totaldue.value,
            "status": "string",
            "agentid": "AGTID"+generateUUID(),
            "batchmonth": batchmonth.value,
            "batchyear": batchyear.value
          }),
          success: function(response){
            // console.log('ajax.success');
            console.log(response);  
            if(response.error == "Unauthorized"){
              swal("",response.message,"error");
            }else{
              swal("",response.message,"success");
              getSingleDebtPortfolioData();
              setTimeout(()=>{
                location.assign('/pages/debt-portfolio.html');
              },2500)
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
                      console.log(response, "500 response");
                      swal("",response.responseJSON.message);
                  },
                  500: function(response) {
                      console.log('ajax.statusCode: 500');
                  }
              }           
        })
        // CONNECTION
    
      }
         
          
    };
  /* -------------------------------------------------------------------------- */
  /*                            EDIT DEBT PORTFOLIO                             */
  /* -------------------------------------------------------------------------- */