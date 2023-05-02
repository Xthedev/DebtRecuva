const baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:EIOJ6OPN";
/* -------------------------------------------------------------------------- */
/*                               FETCH AGENT                                  */
/* -------------------------------------------------------------------------- */
function fecthAgent(){
  
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
  
              let rowContent = "";
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
                <div class="col">
                <div class="card">
                     <div class="card-body">
                         <img src="${row.photo}" width="50px" alt="" class="mt-1">
                         <h5 class="card-title mt-2">${row.firstname} ${row.lastname}</h5>
                         <h6 class="card-subtitle text-light-text">Debtors : 388</h6>
                         <h6 class="card-subtitle text-light-text mt-1">Agents Assigned : 4</h6>
                         <a href="/pages/agent-target-assignment.html" class="card-link btn butt mt-2">Assign Target</a>
                     </div>
                 </div>
            </div>
                `;
                $('#agentTarget').html(rowContent);
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
  