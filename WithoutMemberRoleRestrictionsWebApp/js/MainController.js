/***************************************************General use object creation **************************************************************/
var table;
var memberRentaltable;
var memberTableInitialize;
var myDropzone;
var tempID;
var availabilityVal=0;

$.support.cors = true;
	localStorage.removeItem("Authorization");
	localStorage.setItem("userType","Visitor");
	Dropzone.autoDiscover = false;
//provides an alternative to alerts by displaying in a modal a message
var popAlertModal = function(Title,textDisplay,textColor){
			$('#alertModal').modal('toggle');	
			$("#alert-modal-headline").html("<span class='glyphicon glyphicons-play'></span>" + Title );
			var prompthtml='<p><font color="'+textColor+' ">'+textDisplay+'</font></p><div class="modal-footer"><button type="submit" class="btn btn-danger btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Close</button>  </div>';
			$("#alertContainer").html(prompthtml);
		};;
var enableRegisterButton=function(){
		if(allFilled("register")&& matchingPasswords() && $("#Password").val().length>7){
			$('#registerBtn').removeAttr('disabled');
		} 
		else
			$('#registerBtn').attr('disabled', 'disabled');
	};
var enableLoginButton=function(){
		if($("#LogEmail").val().length>7 && $("#LogPassword").val().length>7){
			$('#loginBtn').removeAttr('disabled');
		} 
		else
			$('#loginBtn').attr('disabled', 'disabled');
	};
 var coverSelected=function(){
				return(myDropzone.files.length>0);
}
				
/***************************************************END GENERAL USE OBJECT CREATION **************************************************************/



/*************************************************** File Naming Functions **************************************************************/
//Creating an UUID to use in a custom generated filename
var generateUUID =function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};	

	
var getFileExtension=function(fileName){
	var fileExt=fileName.split(".");
	var i=fileExt.length-1;
	return fileExt[i];
};
	
var generateNewName=function(fileName) {
	return generateUUID()+"."+getFileExtension(fileName);
};
/*************************************************** END FILE NAMING FUNCTIONS **************************************************************/





/*************************************************** Form Functions **************************************************************/
	//check if input values are filled
 var allFilled=function(formType) {
		var filled = true;
		$('.'+formType).each(function() {
			if($(this).val() == '') filled = false;
		});
		return filled;
};
 
var clearForms=function(){
		$('.form-control').each(function() {			
			$(this).val("");
		});
};

/***************************************************END FORM FUNCTIONS **************************************************************/

/*************************************************** Member related Functions **************************************************************/
var matchingPasswords= function(){
	return ($(" #Password").val()===$(" #confPass").val())
};

var setCredentials = function(token,userType){
	showMemberOnlyAreas();
	localStorage.setItem("Authorization",token);
	localStorage.setItem("userType", userType);
}
var removeCredentials=function(){
	hideMemberOnlyAreas();
	memberRentaltable.clear().draw();
	localStorage.removeItem("Authorization");
	localStorage.setItem("userType","Visitor");
}

var checkMembership=function(){
	var isLogged= localStorage.getItem('userType');
	if(isLogged !== "Client" && isLogged!== "Admin"){
		alert('User must be logged in to perform this operation');
		return false;
	}
	return true;
};

var checkAdmin=function(){
	var isLogged= localStorage.getItem('userType');
	if(isLogged!== "Admin"){
		alert('Action available to Administrators');
	}
	return true;
};

var showMemberOnlyAreas= function(){
	$('#login-tab-button').addClass('hide');
	$('#login-tab-button').removeClass('active');
	
	$('#rental-tab-button').removeClass('hide');
	$('#logout-tab-button').removeClass('hide');
	
	$('#rental-tab-button').addClass('active');
	$('#register-tab-button').addClass('hide');
	
	
	$('#login-container').addClass('fadeout');
	$('#rentals-container').removeClass('fadeout');
	
	setTimeout(function(){
		$(".tab-content").removeClass('active');
		$('#rentals-container').addClass('active');	
	}, 700);
};

var hideMemberOnlyAreas= function(){
	$('.tab').removeClass('active');
	$('#rental-tab-button').addClass('hide');
	$('#logout-tab-button').addClass('hide');
	$('#rental-tab-button').removeClass('active');
	$('#login-tab-button').removeClass('hide');
	$('#login-tab-button').addClass('active');
	$('#register-tab-button').removeClass('hide');
	
	
	$('#login-container').removeClass('fadeout');
	$('#rentals-container').addClass('fadeout');
	
	setTimeout(function(){
		$(".tab-content").removeClass('active');
		$('#login-container').addClass('active');	
		}, 700);
};
/*************************************************** END MEMBER RELATED FUNCTIONS **************************************************************/



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!VIEWS EVENT HANDLING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
$(document).ready(function() {//Document ready start

/*************************************************** View Change  events **************************************************************/
	$('.tab').click(function(){
		clearForms();
		if($(this).attr('id')==='logout-tab-button'){
			popAlertModal("Log-out",'You have been logged-out from the system','green');
	  		removeCredentials();
			return;
		}
		console.log(localStorage.getItem('userType'));
		var navbarActive=$('#navigation').hasClass('in');
		var activeSelected=$(this).hasClass('active');
		if(navbarActive){
			$('#navigation').removeClass('in');		
		}
		if(activeSelected) return;
		
		var tabBind = $(this).attr('data-tab');
		console.log(tabBind);
		
		$('.tab').removeClass('active');
		$(this).addClass('active');
		$('.tab-content').addClass('fadeout');
		
		$("#"+tabBind).removeClass('fadeout');
		setTimeout(function(){
			$(".tab-content").removeClass('active');
			$("#"+tabBind).addClass('active');
		}, 700);

	});
	

/************************************************END View Change events **************************************************************/



/*************************************************** Member Login/Register  events **************************************************************/

$('.close').on('click', function() {
		enableRegisterButton();
	});
$('.register').bind('input', function() {
		enableRegisterButton();
	});
$('.login').on( "input", function() {
		enableLoginButton();
	});

	$('#registerBtn').click(function(){
		console.log("Register");
		var formData = new FormData();
		formData.append('Email',$(" #Email").val());
		formData.append('FirstName',$(" #FirstName").val());
		formData.append('LastName',$(" #LastName").val());
		formData.append('Password',$(" #Password").val());
		formData.append('Phone',$(" #Phone").val());
		formData.append('Street',$(" #Street").val());
		formData.append('City',$(" #City").val());
		formData.append('State',$(" #State").val());
		formData.append('PostalCode',$(" #PostalCode").val());
		RegisterMember(formData);
		
	});

	$('#loginBtn').click(function(){
		console.log("login");
		var formData = new FormData();
		formData.append('Email',$("#LogEmail").val());
		formData.append('Password',$("#LogPassword").val());
		LoginMember(formData);				

});
	
  $('#logout-button').click(function(){
	  popAlertModal("Log-out",'You have been logged-out from the system','green');
	  removeCredentials();
  });

/************************************************END Login/Register  events **************************************************************/



/*************************************************** Books Forms and Dropzone events **************************************************/

//Validating New book fields - New book modal
		$('.books').bind('keyup', function() {
			if(allFilled("books") && coverSelected()){
				$('#newbookform').removeAttr('disabled');
			} 
			else
				$('#newbookform').attr('disabled', 'disabled');
		});

		 //Set the modal to an insertion form or an update form
		$(document).on( 'click', '.glyphicon-pencil', function () {
			if(coverSelected){
					Dropzone.forElement("#uploadme").removeAllFiles(true);
				}
			var modifyId=$(this).parents('tr').children(":first").text();
			var modifyAuthor=$(this).parents('tr').children(":nth-child(3)").text();
			var modifyTitle=$(this).parents('tr').children(":nth-child(2)").text();
			var modifyPages=$(this).parents('tr').children(":nth-child(4)").text();
			$(" #Author").val(modifyAuthor);
			$(" #Title").val(modifyTitle);
			$(" #Pages").val(modifyPages);
				
			$('#book-modal-headline').html('<span class="glyphicon glyphicon-book"></span> Update book with id: ' + modifyId);
			$('#modal-form-id').prop("value",modifyId);
			$('#newbookform').html('<span class="glyphicon glyphicon-edit"></span> Update book');
			$('#newbookform').prop('disabled', false);
			$('#newbookform').prop('id', 'updatebookform');
			$('#myModal').modal('toggle');

		} );

	 	//cleans the form and prepares the modal as an insertion form modal
		$(document).on( 'click', '#book-modal-button', function () {
			if(coverSelected){
					Dropzone.forElement("#uploadme").removeAllFiles(true);
				}
			$(" #Author").val("");
			$(" #Title").val("");
			$(" #Pages").val(0);
			$(" #Description").val("");
			$('#book-modal-headline').html('<span class="glyphicon glyphicon-book"></span> Insert Book');
			$('#updatebookform').html('<span class="glyphicon glyphicon-edit"></span> Insert book');
			$('#updatebookform').prop('id', 'newbookform');
			$('#newbookform').prop('disabled', true);

		} );



/************************************************END Books Forms and Dropzone events **************************************************/






/*************************************************** Book Display Table events **************************************************/

	//Delete the selected element by clicking its trashcan icon/ deletion node
	
	
    $(document).on( 'click', '.glyphicon-trash', function () {
	tempID=$(this).parents('tr').children(":first").text();
	$('#alertModal').modal('toggle');	
		$("#alert-modal-headline").html("<span class='glyphicon glyphicon-remove'></span> Book: " +tempID );
		var prompthtml='<p><font color="red">Do you want to delete this book?</font></p><div class="modal-footer"><button type="submit" class="btn btn-danger btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>  <button type="submit" id="confirm-del" class="btn btn-success btn-default pull-right" data-dismiss="modal"><span class="glyphicon glyphicon-edit"></span> Proceed</button> </div>';
        $("#alertContainer").html(prompthtml);

    } );
	//Deletion prompt after clicking the trash-can
	 $(document).on( 'click', '#confirm-del', function () {
		deleteBook(tempID);
	 });
	
	//Update the selected element's availability by clicking its icon
	
	$(document).on( 'click', '.glyphicon-th-large', function () {
	tempID=$(this).parents('tr').children(":first").text();
	availabilityVal=$(this).parents('tr').find(':nth-child(6)').html();
	$('#alertModal').modal('toggle');	
		$("#alert-modal-headline").html("<span class='glyphicon glyphicon-th-large'></span> Book: " +tempID );
		var prompthtml='<p><font color="black">Set this book availability</font></p>	<input type="number" min=0 value='+availabilityVal +' class="form-control" id="newAv" placeholder="Enter new Amount" required>		<div class="modal-footer"><button type="submit" class="btn btn-danger btn-default pull-left" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Cancel</button>  <button type="submit" id="confirm-availability" class="btn btn-success btn-default pull-right" data-dismiss="modal"><span class="glyphicon glyphicon-edit"></span> Proceed</button> </div>';
        $("#alertContainer").html(prompthtml);

    } );
	
	
	
	//Update availability prompt after clicking the squares
	 $(document).on( 'click', '#confirm-availability', function () {
		setAvailability(tempID,$('#newAv').val());
	 });
	
	//Actions for Taking and returning books
	//Take a book
	$(document).on( 'click', '.glyphicon-open', function () {
		tempID=$(this).parents('tr').children(":first").text();
		returnandtakeBooks("Take", 0, tempID);
		//validateToken('Admin');
	});
	
	
	

	//Displays the cover image in a modal
    $(document).on( 'click', '.resized-img', function () {
        var imgSrc=$(this).parents('tr').find(':nth-child(5)').find('img').attr('src');
		var fullImage="<img class='img-responsive' placeholder='image' src='" + imgSrc+ "'>";
		var bookTitle =$(this).parents('tr').find(':nth-child(2)').text();
		$('#alertModal').modal('toggle');	
		$("#alert-modal-headline").html("<span class='glyphicon glyphicon-picture'></span>" + bookTitle);
        $("#alertContainer").html(fullImage);
    });

/************************************************END Book Display Table events **************************************************/



/*************************************************** Member rental Table events **************************************************/

	
	//Return a book
 $(document).on( 'click', '.glyphicon-save', function () {
	 	var ID_Rental=$(this).parents('tr').children(":nth-child(1)").text();
		var ID_Book=$(this).parents('tr').children(":nth-child(2)").text();
	 	console.log(ID_Rental);
		returnandtakeBooks("Return", ID_Rental, ID_Book);
 });

/************************************************END Member rental Table events **************************************************/
}); //END DOCUMENT READY