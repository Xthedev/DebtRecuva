const baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:EIOJ6OPN";
const loader = (contentArea = "", colspan = "") => {
    document.querySelector(contentArea).innerHTML =`<tr>
    <td colspan="${colspan}" class="text-center">
      <img src="/assets/img/loader.gif" alt=""/>
    </td>
    </tr>`
}

const notTableLoader = (contentArea = "") => {
  document.querySelector(contentArea).innerHTML =`
  <div>
    <img src="/assets/img/loader.gif" alt=""/>
  </div>
  `
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
/*                                 ADD COMAPNY                                */
/* -------------------------------------------------------------------------- */
function addCompany(){
  


    // selecting the input element and get its value 
    let companyname = document.getElementById("companyname");
    let companyemail = document.getElementById("companyemail");
    let companymobile = document.getElementById("companymobile");
    let companylocation = document.getElementById("companylocation");
    let rcnumber = document.getElementById("rcnumber");
    var companylogo = document.getElementById("agentimg");
    // console.log(companylogo)

    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    
    if(!companyemail.value){
      swal("Enter an email address!");
      companyemail.focus();
      return false;
    }else if(!companyname.value || !companymobile.value || !companylocation.value || !rcnumber.value){
      swal("All fields are required!");
      companyname.focus();
      return false;
    }else if(!(companyemail.value.match(mailformat))){
      swal("You have entered an invalid email address!");
      companyemail.focus();
      return false;
    }else if(!companylogo){
      swal("Upload an image!");
      companylogo.focus();
      return false;
    }else {
      // CONNECTION 
      // loader('#loader',);
      $.ajax({
        url: `${baseURL}/company`,
        type: 'post',
        "headers": {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('access'),
        },
        "data": JSON.stringify({
            "companyid": "CMP"+generateUUID(),
            "companyname": companyname.value,
            "companyimage": companylogo.src,
            "companymobile": companymobile.value,
            "companyemail": companyemail.value,
            "companylocation": companylocation.value,
            "rcnumber": rcnumber.value
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
              location.assign('/pages/company-accounts.html');
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
/*                                 ADD COMAPNY                                */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                                FETCH COMAPNY                               */
/* -------------------------------------------------------------------------- */
function fetchCompany(){
  let currentPage = window.location.pathname;
  // alert(currentPage);
  // if(currentPage.includes("/company-accounts")){
    loader('#allCompanies', 12);
  // }
  

    // CONNECTION 
    $.ajax({
    url: `${baseURL}/company`,
    type: 'GET',
    "headers": {
        "Content-Type": "application/json",
        // "authorization": localStorage.getItem('access'),
    },
    success: function(response){
        // console.log('ajax.success');
        console.log(response);  
        if(response.error == "Unauthorized"){
            swal("",response.message,"");
        }else{
          // swal(response.message,"");

          // TABLE
          let thedata = response.data;
          // console.log(thedata.length);
          if (thedata.length > 0) {
            // $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>Company Found</h3></td></tr>");

            let rowContent, rowContent_debtAssignment;
            // Let's Start looping into the data coming from database
            $.each(thedata.reverse(), (index, row) => {
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
              /* ------------ FETCH ALL COMPANIES IN COMAPNY ACCOUNT HTML PAGE ------------ */
              rowContent += `
                <tr style="overflow:none;">
                  <td class="d-flex fw-bold">
                    <div class="rounded-circle p-1">
                      <img width="40px" src="${row.companyimage}" />
                    </div>
                  </td>
                  <td class=" fw-bold">${row.companyname}</td>
                  <td class=" fw-bold">${row.companymobile}</td>
                  <td class=" fw-bold">${row.companyemail}</td>
                  <td class=" fw-bold">${row.companylocation}</td>
                  <td class=" fw-bold">${row.rcnumber}</td>
                  <td class="">
                    <div class="dropdown dropstart">
                      <button class="btn pt-0 pb-1 px-1" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="/assets/img/ellispe.png" alt="" width="20px">
                      </button>
                      <ul class="dropdown-menu " aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" href="/pages/edit-company-accounts.html?comp=${row.companyid}">Edit</a></li>
                        <li><a class="dropdown-item" href="javascript:void(0)" onclick="deleteSingleCompany('${row.companyid}')">Delete</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              `;
              $('#allCompanies').html(rowContent);
              /* ------------ FETCH ALL COMPANIES IN COMAPNY ACCOUNT HTML PAGE ------------ */

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
            $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h6 class='pt-2'>No company added yet</h6></td></tr>");
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
/* -------------------------------------------------------------------------- */
/*                                FETCH COMAPNY                               */
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
/*                           POPULATE COMPANY  DATA                           */
/* -------------------------------------------------------------------------- */
function getSingleCompanyData(){
  let companyid = location.href.split("comp=")[1];
  // alert(companyid);

  // CONNECTION 
  $.ajax({
  url: `${baseURL}/company/${companyid}`,
  type: 'GET',
  "headers": {
      "Content-Type": "application/json",
      "authorization": localStorage.getItem('access'),
  },
  success: function(response){
      // console.log('ajax.success');
      // console.log(response);  
      if(response.error == "Unauthorized"){
          swal("",response.message,"");
      }else{
        // swal(response.message,"");

        let thedata = response.data;
    
  
        console.log(thedata, "The Company Details");
        $('#companyid').val(thedata.companyid);
        $('#companyname').val(thedata.companyname);
        $('#companyemail').val(thedata.companyemail);
        $('#companycontact').val(thedata.companymobile);
        $('#daysinarrears').val(thedata.daysinarrears);
        $('#companylocation').val(thedata.companylocation);
        $('#rcnumber').val(thedata.rcnumber);
        var photo = thedata.companyimage;
        // console.log(photo)
        $("#container").append('<img src='+photo+' width="150px" id="existingDBimage" />');
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
      console.log(xhr.responseJSON, "xhr");
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
/* -------------------------------------------------------------------------- */
/*                           POPULATE COMPANY DATA                            */
/* -------------------------------------------------------------------------- */






/* -------------------------------------------------------------------------- */
/*                          EDIT COMPANY ACCOUNTS                             */
/* -------------------------------------------------------------------------- */
function editCompany(){
  // Find current page
  // const activePage = window.location;
  let companyid = location.href.split("comp=")[1];
  // alert(companyid);

    // selecting the input element and get its value 
    let companyId = document.getElementById("companyid");
    let companyname = document.getElementById("companyname");
    let companyemail = document.getElementById("companyemail");
    let companycontact = document.getElementById("companycontact");
    let companylocation = document.getElementById("companylocation");
    let rcnumber = document.getElementById("rcnumber");
    var companyimg = document.getElementById("agentimg");
    var existingDBimage = document.getElementById("existingDBimage");

    let imgSrc;
    if(localStorage.getItem('currentImgType')=="newImage"){
      imgSrc = companyimg.src;
    }else{
      imgSrc = existingDBimage.src;
    }

    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    
    if(!companyname.value || !companyemail.value || !companycontact.value || !companylocation.value){
      swal("All fields are required");
      companyname.focus();
      return false;
    }else if(!(companyemail.value.match(mailformat))){
      swal("You have entered an invalid email address!");
      companyemail.focus();
      return false;
    }else {
      // CONNECTION 
      $.ajax({
        url: `${baseURL}/company/${companyid}`,
        type: 'post',
        "headers": {
          "Content-Type": "application/json",
          // "authorization": localStorage.getItem('access'),
        },
        "data": JSON.stringify({
          "companyid": companyId.value,
          "companyname": companyname.value,
          "companyemail": companyemail.value,
          "companymobile": companycontact.value,
          "companylocation": companylocation.value,
          "rcnumber": rcnumber.value,
          "companyimage": imgSrc
        }),
        success: function(response){
          // console.log('ajax.success');
          console.log(response);  
          if(response.error == "Unauthorized"){
            swal("",response.message,"warning");
          }else{
            swal("",response.message,"success");
            getSingleCompanyData();
            setTimeout(()=>{
              location.assign('/pages/company-accounts.html');
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
/*                            EDIT COMPANY ACCOUNTS                           */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                           DELETE DEBT PORTFOLIO                            */
/* -------------------------------------------------------------------------- */
function deleteSingleCompany(companyid){

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
        url: `${baseURL}/company/${companyid}`,
        type: 'DELETE',
        "headers": {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('access')
        },
        success: function(response){
          // console.log('ajax.success');
          console.log(response);  
          if(response.error == "Unauthorized"){
            swal("",response.message,"");
          }else{
            
            swal("Poof! Your imaginary file has been deleted!", {
              icon: "success",
            });
            fetchCompany();

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






/* ------------------------ ------------------------ ------------------------ */
/* ---------------------- FETCH COMPANY DEBT ASSIGNMENT --------------------- */
/* ------------------------ ------------------------- ----------------------- */
function fetchCompany_debtAssignment(){
  // CONNECTION 
    $.ajax({
    url: `${baseURL}/company`,
    type: 'GET',
    "headers": {
        "Content-Type": "application/json",
        "authorization": localStorage.getItem('access'),
    },
    success: function(response){
        // console.log('ajax.success');
        console.log(response);  
        if(response.error == "Unauthorized"){
            swal("",response.message,"");
        }else{
          // swal(response.message,"");

          // TABLE
          let thedata = response.data;
          console.log(thedata.length);
          if (thedata.length > 0) {
            // $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>Company Found</h3></td></tr>");

            let rowContent_debtAssignment ="";
            // Let's Start looping into the data coming from database
            for(let i=0; i<thedata.length; i++){

              let row = thedata[i];
              let index = i + 1;

              /* ------------ FETCH ALL COMPANIES IN DEBT_ASSIGNMENT HTML PAGE ------------ */
              rowContent_debtAssignment += `
            

                <div class="col-lg-3 col-md-6 col-sm-6 text-center mt-3">
                  <div class="card">
                      <div class="card-body">
                          <img src="${row.companyimage}" width="40px" height="" class="mt-1">
                          <h5 class="card-title mt-2" id="fecthedcompanyname">${row.companyname}</h5>
                          <h6 class="card-subtitle mb-2 text-light-text">Debtors : 299</h6>
                          <h6 class="card-subtitle mb-2 text-light-text">Agents Assigned : 4</h6>
                          <a href="javascript:void(0)" onclick="companyID('${row.companyid}')" class="card-link btn butt mt-2 fw-bold px-3">View Assigned</a>
                      </div>
                  </div>
                </div>
              `;
              /* ------------ FETCH ALL COMPANIES IN DEBT_ASSIGNMENT HTML PAGE ------------ */
              
            };
            $('#allCompanies_debtAssignment').html(rowContent_debtAssignment);
          } else {
            $('#allCompanies_debtAssignment').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No company added yet</h3></td></tr>");
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
};

const companyID =(companyid)=>{
  // alert(companyid)
  localStorage.setItem('COMPID', companyid);
  window.location.href = "auto-insurance.html";
}
/* ------------------------------ ------------- ----------------------------- */
/* ---------------------- FETCH COMPANY DEBT ASSIGNMENT --------------------- */
/* -------------------------------- --------- ------------------------------- */


