// $(document).ready(function(){
//   // e.preventDefault();
//   $(document).on('click','#strength-option',function(){
//
//   });
// });

$('#strength-option').click(function() {
    var checked = $(this).attr('checked');
    if (checked) {
        $('#toggle-strength').toggle('slide');
        $(this).attr('checked', false);
    }
    else {
        $(this).attr('checked', true);
    }
});
$('#cardio-option').click(function() {
    var checked = $(this).attr('checked');
    if (checked) {
        $('#toggle-cardio').toggle('slide');
        $(this).attr('checked', false);
    }
    else {
        $(this).attr('checked', true);
    }
});

//
// $(function() {
//     $('#login-form-link').click(function(e) {
// 		$("#login-form").delay(100).fadeIn(100);
//  		$("#register-form").fadeOut(100);
// 		$('#register-form-link').removeClass('active');
// 		$(this).addClass('active');
// 		e.preventDefault();
// 	});
// 	$('#register-form-link').click(function(e) {
// 		$("#register-form").delay(100).fadeIn(100);
//  		$("#login-form").fadeOut(100);
// 		$('#login-form-link').removeClass('active');
// 		$(this).addClass('active');
// 		e.preventDefault();
// 	});
//
// });
