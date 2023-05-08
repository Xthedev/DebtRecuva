const baseURL = "https://x8ki-letl-twmt.n7.xano.io/api:EIOJ6OPN";

const loader = (contentArea = "", colspan = "") => {
  document.querySelector(contentArea).innerHTML = `
    <img src="/assets/img/loader2.gif" alt="" width="40px"/>`
}

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
function logIn(){
    
  // selecting the input element and get its value 
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  // let userType = document.getElementById("usertype");    
  var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  
  if(!email.value){
    swal("","Enter an email address!","warning");
    email.focus();
    return false;
  }else if(!password.value){
    swal("","Enter your password!","warning");
    password.focus();
    return false;
  }
  // else if(!userType.value){
  //   swal("Select a usertype!");
  //   userType.focus();
  //   return false;
  // }
  else if(!(email.value.match(mailformat))){
    swal("","You have entered an invalid email address!","warning");
    email.focus();
    return false;
  }else {
    
    // CONNECTION 
    // loader('#loader');
    $.ajax({
      url: `${baseURL}/auth/login`,
      type: 'post',
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "email":  email.value,
        "password": password.value,
        // "usertype": userType.value
      }),
      success: function(response){
        // console.log('ajax.success');
        console.log(response);  
        if(response.error == "Unauthorized"){
          swal("",response.message,"warning");
        }else{
          swal("",response.message,"success");
          localStorage.setItem('access', response.authToken);
          localStorage.setItem('user',JSON.stringify(response.data);
          setTimeout(()=>{
            location.assign('/pages/index2.html');
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
        }
      }           
    })
    // CONNECTION

  }
     
      
};
/* -------------------------------------------------------------------------- */
/*                                END OF LOGIN                                */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                                   SIGNUP                                   */
/* -------------------------------------------------------------------------- */
function signUp(){
    
  // selecting the input element and get its value
  let firstName = document.getElementById("firstname");
  let lastName = document.getElementById("lastname");
  let email = document.getElementById("email");
  let mobileNo = document.getElementById("mobileno");
  let password = document.getElementById("password");
  let userType = document.getElementById("usertype");
  let checkedBox = document.querySelectorAll('input[name="checked"]');
  
  var mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

  if(!firstName.value || !lastName.value || !email.value || !mobileNo.value || !userType.value || !password.value){
    swal({
      text: "All fields are required",
      icon: "warning",
    })
    firstName.focus();
    return false;
  }else if(checkedBox==""){
    swal({
      text: "Please accept our terms and condition",
      icon: "warning",
    })
    return false;
  }else if(!(email.value.match(mailformat))){
    swal("","You have entered an invalid email address!","warning");
    email.focus();
    return false;
  }else {
    // alert("fdcd");

    // USER ID 
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
    // USER ID


    // CONNECTION 
    // loader('#loader');
    $.ajax({
      url: `${baseURL}/auth/signup`,
      type: 'post',
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "email":  email.value,
        "password": password.value,
        "mobile": mobileNo.value,
        "firstname": firstName.value,
        "lastname": lastName.value,
        "usertype": userType.value,
        "userid": "DBTRCVA"+generateUUID()
      }),
      success: function(response){
        // console.log('ajax.success');
        console.log(response);  
        if(response.error == "Unauthorized"){
          swal("",response.message,"warning");
        }else{
          swal("",response.message,"success");
          setTimeout(()=>{
            location.assign('sign-in.html');
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
          swal("",xhr.responseJSON.message,"warning");
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
              }
          }           
    })
    // CONNECTION
  
  };
}
/* -------------------------------------------------------------------------- */
/*                                END OF SIGNUP                               */
/* -------------------------------------------------------------------------- */
