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
/*                              ADD NEW AGENT                                 */
/* -------------------------------------------------------------------------- */
function addNewAgent(){

    // selecting the input element
    let agtfirstname = document.getElementById("agtfirstname");
    let agtlastname = document.getElementById("agtlastname");
    let agtemail = document.getElementById("agtemail");
    let agtnumber = document.getElementById("agtnumber");
    let agtusertype = document.getElementById("agtusertype");
    var agtimg = document.getElementById("agentimg");
    // console.log(agtimg);

    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    
    if(!agtfirstname.value || !agtlastname.value || !agtemail.value || !agtnumber.value || !agtusertype.value){
      swal("All fields are required");
      agtfirstname.focus();
      return false;
    }else if(!(agtemail.value.match(mailformat))){
      swal("You have entered an invalid email address!");
      agtemail.focus();
      return false;
    }else if(!agtimg){
      swal("Upload an image!");
      agtimg.focus();
      return false;
    }else {
      // CONNECTION 
    //   loader('#allCompanies', 5),
      $.ajax({
        url: `${baseURL}/user`,
        type: 'post',
        "headers": {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem('access'),
        },
        "data": JSON.stringify({
          "userid": "AGT"+generateUUID(),
          "firstname": agtfirstname.value,
          "lastname": agtlastname.value,
          "email": agtemail.value,
          "mobile": agtnumber.value,
          "usertype": agtusertype.value,
          "photo": agtimg.src,
          "status": 0
        }),
        success: function(response){
          console.log('ajax.success');
          console.log(response);  

          if(response.error == "Unauthorized"){
            swal("",response.message,"");
          }else{
            swal("","Agent added successfully","success");
            setTimeout(()=>{
              location.assign('/pages/agents.html');
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
                  console.log('ajax.statusCode: 401');
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
/*                              ADD NEW AGENT                                 */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                               FETCH AGENT                                  */
/* -------------------------------------------------------------------------- */
function fecthAgent(){
  loader('#allCompanies', 9);

    // CONNECTION 
    $.ajax({
    url: `${baseURL}/user`,
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
          // let thedata = response.data;
          // console.log(thedata.length);
          if (response.length > 0) {
            // $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>Company Found</h3></td></tr>");

            let rowContent;
            // Let's Start looping into the data coming from database
            $.each(response.reverse(), (index, row) => {

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
                <tr style="overflow:none;">
                  <td class="">
                    <img width="50px" src="${row.photo}" />
                  </td>
                  <td class="">${row.firstname}</td>
                  <td class="">${row.lastname}</td>
                  <td class="">${row.email}</td>
                  <td class="">${row.mobile}</td>
                  <td class="">${row.usertype}</td>
                  <td class="">${row.status}</td>
                  <td class="">
                    <div class="dropdown">
                      <button class="btn pt-0 pb-1 px-1" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="/assets/img/ellispe.png" alt="" width="20px">
                      </button>
                      <ul class="dropdown-menu mb-5" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" href="/pages/edit-agent.html?agt=${row.userid}">Edit</a></li>
                        <li><a class="dropdown-item" href="javascript:void(0);" onclick="deleteSingleAgent('${row.userid}')">Delete</a></li>
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
            $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Agents added yet</h3></td></tr>");
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


function fecthAgentForAgentList(){
  // loader('#allCompanies', 9);

    // CONNECTION 
    $.ajax({
    url: `${baseURL}/user`,
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
          // let thedata = response.data;
          // console.log(thedata.length);
          if (response.length > 0) {
            // $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>Company Found</h3></td></tr>");

            let rowContent="";
            // Let's Start looping into the data coming from database
            $.each(response.reverse(), (index, row) => {

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
              <div class="col-lg-3 col-md-12 col-sm-12 text-center mt-md-3 mt-sm-3">
                <div class="card d-flex align-items-center">
                    <div class="card-body">
                        <img src="${row.photo}" width="70px" height="7  0px" alt="" class="mt-1 rounded-circle">
                        <h5 class="card-title mt-2">${row.firstname} ${row.lastname}</h5>
                        <h6 class="card-subtitle text-light-text">Call Agent</h6>
                        <h6 class="card-subtitle mt-1 text-light-text">Uyo</h6>
                        <div class="">
                            <a href="javascript:void(0);" class="card-link btn butt px-4 mt-2" onclick="assignAgentToaCompany('${row.userid}')">Assign</a>
                        </div>
                    </div>
                </div>
              </div>
              `;
              $('#allCompanies').html(rowContent);

            
            });
          } else {
            $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h6 class='pt-2'>No Agents added yet</h6></td></tr>");
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
/*                               FETCH AGENT                                  */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                               DELETE AGENT                                 */
/* -------------------------------------------------------------------------- */
function deleteSingleAgent(user_id){
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this agent data!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {

      // console.log(user_id)
      // CONNECTION 
      $.ajax({
        url: `${baseURL}/user/${user_id}`,
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
            
            swal("Poof! Agent has been deleted!", {
              icon: "success",
            });
            fecthAgent();

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
                  console.log('ajax.statusCode: 401');
                },
                404: function(response) {
                    console.log('ajax.statusCode: 404', response);
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
/*                              DELETE AGENT                                  */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                              POPULATE AGENT                                */
/* -------------------------------------------------------------------------- */
function getSingleAgentData(){
  let userid = location.href.split("agt=")[1];
  // alert(debtportfolioid);

  // CONNECTION 
  $.ajax({
  url: `${baseURL}/user/${userid}`,
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
    

        console.log(thedata, "The Agent Details");
        $('#userid').val(thedata.userid);
        $('#agtfirstname').val(thedata.firstname);
        $('#agtlastname').val(thedata.lastname);
        $('#agtemail').val(thedata.email);
        $('#agtmobile').val(thedata.mobile);
        var photo = thedata.photo;
        // console.log(photo)
        $("#container").append('<img src='+photo+' width="150px" class="rounded" id="existingDBimage" />');
        $('#agtusertype').val(thedata.usertype);
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
              console.log('ajax.statusCode: 500', response);
              console.log(response, "500 response");
              swal("",response.responseJSON.message);
          }
      }           
  })
  // CONNECTION

}
/* -------------------------------------------------------------------------- */
/*                              POPULATE AGENT                                */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                         ASSIGN AGENT TO A COMPANY                          */
/* -------------------------------------------------------------------------- */
function assignAgentToaCompany(agentID){
  
  // Find current page
  let companyID = location.href.split("comp=")[1];
  console.log(companyID)
  $.ajax({
    url: `${baseURL}/companyassigned`,
    type: 'post',
    "headers": {
      "Content-Type": "application/json",
      "authorization": localStorage.getItem('access')
    },
    "data": JSON.stringify({
      "dataassignedid": "COMP_AGT"+generateUUID(),
      "companyid": companyID,
      "agentsid": agentID
    }),
    success: function(response){
      // console.log('ajax.success');
      console.log(response);  
      if(response.error == "Unauthorized"){
        swal("",response.message,"error");
      }else{
        swal("",response.message,"success");
        getSingleAgentData();
        setTimeout(()=>{
          location.assign('/pages/auto-insurance.html?comp='+localStorage.getItem('COMPID'));
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
}
/* -------------------------------------------------------------------------- */
/*                         ASSIGN AGENT TO A COMPANY                          */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                                  EDIT AGENT                                */
/* -------------------------------------------------------------------------- */
function editAgentRecord(){

  // Find current page
  // const activePage = window.location;
  let userid = location.href.split("agt=")[1];
  // alert(userid);

    // selecting the input element and get its value 
    let agtfirstname = document.getElementById("agtfirstname");
    let agtlastname = document.getElementById("agtlastname");
    let agtemail = document.getElementById("agtemail");
    let agtmobile = document.getElementById("agtmobile");
    let agtusertype = document.getElementById("agtusertype");
    var agtimg = document.getElementById("agentimg");
    var existingDBimage = document.getElementById("existingDBimage");

    let imgSrc;
    if(localStorage.getItem('currentImgType')=="newImage"){
      imgSrc = agtimg.src;
    }else{
      imgSrc = existingDBimage.src;
    }

    var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    
    if(!agtfirstname.value || !agtlastname.value || !agtemail.value || !agtmobile.value || !agtusertype.value){
      swal("All fields are required");
      agtfirstname.focus();
      return false;
    }else if(!(agtemail.value.match(mailformat))){
      swal("","You have entered an invalid email address!","error");
      agtemail.focus();
      return false;
    }else {
      // CONNECTION 
      $.ajax({
        url: `${baseURL}/user/${userid}`,
        type: 'post',
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "status": 0,
          "firstname": agtfirstname.value,
          "lastname": agtlastname.value,
          "email": agtemail.value,
          "mobile": agtmobile.value,
          "usertype": agtusertype.value,
          "photo": imgSrc
        }),
        success: function(response){
          // console.log('ajax.success');
          console.log(response);  
          if(response.error == "Unauthorized"){
            swal("",response.message,"error");
          }else{
            swal("",response.message,"success");
            getSingleAgentData();
            setTimeout(()=>{
              location.assign('/pages/agents.html');
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



/* ---------------------------------- ----- --------------------------------- */
/* ------------------------ FECTH NEWLY ASSIGN AGENT ------------------------ */
/* ---------------------------------- ----- --------------------------------- */
function fecthNewlyAddedAgent(){
  // let COMPID = JSON.parse(localStorage.getItem('COMPID'));
  // let cmpID = COMPID
  // alert(cmpID)
  // CONNECTION 
    $.ajax({
    url: `${baseURL}/companyassigned/bycompanyid/`+ localStorage.getItem('COMPID'),
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
          // console.log(thedata.length);
          if (thedata.length > 0) {
            // $('#allCompanies').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>Company Found</h3></td></tr>");

            let rowContent = "";
            

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
              rowContent +=`
              <div class="col-lg-3 col-md-6 col-sm-6 text-center mt-md-3 mt-sm-3">
                <div class="card d-flex align-items-center">
                    <div class="card-body">
                      <img src="/assets/img/agent-profile.png" width="100px" alt="" class="mt-1">
                      <h5 class="card-title mt-2">${row.firstname}</h5>
                      <h6 class="card-subtitle mb-2 text-light-text">Call Agent</h6>
                      <h6 class="card-subtitle mb-2 text-light-text">Uyo</h6>
                      <a href="/pages/auto-insurance-profile.html?assignedagt=${row.dataassignedid}" class="card-link btn butt btn-sm px-4 py-1 mt-2">View</a>
                      <a href="javascript:void(0);" onclick="deleteAssignedAgent('${row.dataassignedid}')" class="card-link btn butt-red btn-sm px-3 py-1 m-0 mt-2">Remove</a>
                    </div>
                  </div>
              </div>
              `
              ;
              $('#newlyaddedagent').html(rowContent);
              
            });
            
          } else {
          // console.log(rowContent+"nskfdbk");

            $('#newlyaddedagent').html("<tr><td colspan='9' class='text-center'><h3 class='pt-2'>No Agent Assign yet</h3></td></tr>");
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
/* ---------------------------------- ----- --------------------------------- */
/* ------------------------ FECTH NEWLY ASSIGN AGENT ------------------------ */
/* ---------------------------------- ----- --------------------------------- */



/* -------------------------------------------------------------------------- */
/*                            DELETE ASSIGN AGENT                             */
/* -------------------------------------------------------------------------- */
function deleteAssignedAgent(dataassigned_id){
  console.log(dataassigned_id)

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
        url: `${baseURL}/companyassigned/${dataassigned_id}`,
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
            fecthNewlyAddedAgent();

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
                  console.log('ajax.statusCode: 401');
                },
                404: function(response) {
                    console.log('ajax.statusCode: 404', response);
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
/*                           DELETE ASSIGN AGENT                              */
/* -------------------------------------------------------------------------- */
