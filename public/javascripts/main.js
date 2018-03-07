console.log("Main.js Here!");


function formSubmit() {
    console.log("Click");
    var data = document.getElementById('registerForm');
    
};

/*

$( "#registerForm" ).click( function() {
    $.ajax({

        method: "POST",
        url: "/welcome/ajaxAuthPars",
        data: { username: $( "#name" ).val(), email: $( "#email" ).val(), password: $( "#pw" ).val() },
        success: function( ) {
            console.log("Successful Submission!");
        }
    });
});




$('#registerForm').validate({
    rules: {
        name : {required:true},
        email : {required:true
    },
    messages : {
        name : "Required!",
        email : "Required!"
    },
    submitHandler: function(form) {
        form.submit();
    }
}}
);

*/