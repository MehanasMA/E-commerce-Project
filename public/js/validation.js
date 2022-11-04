function signUpValidation() {

    let flag = 0;

    let usercheck = /^[A-Za-z.]{3,30}$/
    // let passwordcheck = /(?=.[0-9])(?=.[!#$%^&])[a-zA]-Z0-9!#$%^&]{8,16}$/


    const name = document.getElementById('name').value.trim()
    const mobile = document.getElementById('mobile').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    const confirmpassword = document.getElementById('Confirmpassword').value.trim()





    if (usercheck.test(name) == "") {
        document.getElementById("nameError").innerHTML = "required"
        document.getElementById("name").style.borderColor = "red"
        flag = 1

    }
    else {
        document.getElementById('name').style.borderColor = "green"
    }




    if (mobile == "") {
        document.getElementById("mobileError").innerHTML = "required"
        document.getElementById("moobile").style.borderColor = "red"
        flag = 1
    } else {
        document.getElementById('mobile').style.borderColor = "green"
    }

    if (email == "") {
        document.getElementById("emailError").innerHTML = "required"
        document.getElementById("Email").style.borderColor = "red"
        flag = 1
    } else {
        document.getElementById('Email').style.borderColor = "green"

    }


    if (password == "") {
        document.getElementById("passwordError").innerHTML = "required"
        document.getElementById("Password").style.borderColor = "red"
        flag = 1
    } else {
        document.getElementById('Password').style.borderColor = "green"

    }

    if (confirmpassword == "") {
        document.getElementById("confirmpasswordError").innerHTML = "incorrect password"
        document.getElementById("Password").style.borderColor = "red"
        flag = 1

    }
    else if (password !== cnfmpassword) {
        document.getElementById("cnfmpasswordError").innerHTML = "required"
        flag = 1


    }
    else {

        document.getElementById('Password').style.borderColor = "green"

    }



    if (flag == 1) {
        return false
    }
}


// signup validation-->




// userLoginvalidation---->


function userLoginValidation() {

    let flag = 0;


    // let passwordcheck = /(?=.[0-9])(?=.[!#$%^&])[a-zA]-Z0-9!#$%^&]{8,16}$/



    const Email = document.getElementById('Email').value.trim()
    const Password = document.getElementById('Password').value.trim()



    if (Email == "") {
        document.getElementById("emailError").innerHTML = "required"
        document.getElementById("Email").style.borderColor = "red"
        flag = 1
    } else {
        document.getElementById('Email').style.borderColor = "green"

    }

    if (Password == "") {
        document.getElementById("passwordError").innerHTML = "required"
        document.getElementById("Password").style.borderColor = "red"
        flag = 1
    }
    // else if (passwordcheck.test(Password) == "") {
    //     document.getElementById("passwordError").innerHTML = "gsgsh"

    //     flag = 1
    // }

    else {
        document.getElementById('Password').style.borderColor = "green"

    }
    if (flag == 1) {
        return false
    }


}



// adimnLoginpage--->


function adminValidation() {


    flag = 0

    const Email = document.getElementById('Email').value.trim()
    const Password = document.getElementById('password').value.trim()



    if (Email == "") {
        document.getElementById("usernameError").innerHTML = "required"
        document.getElementById("Email").style.borderColor = "red"
        flag = 1
    } else {
        document.getElementById('Email').style.borderColor = "green"

    }

    if (Password == "") {
        document.getElementById("PasswordError").innerHTML = "required"
        document.getElementById("password").style.borderColor = "red"
        flag = 1
    }

    else {
        document.getElementById('password').style.borderColor = "green"

    }
    if (flag == 1) {
    }
}