var validateToken=function(Role){
	
	if(localStorage.getItem("userType")=== "Visitor"){
		popAlertModal("Error",'Not Logged-in','red');
		return "Visitor";
	}	   
	$.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
            },
            url: "http://localhost:8080/LibraryRest/api/Members/validateToken",
            success: function(data) {
				console.log(data);
				if(Role===data.Role && data.isValid){
					popAlertModal("Success",'Valid '+ data.Role+' token','green');
				}
				else{
					removeCredentials();
					popAlertModal("Error",'Expired/Invalid Credentials or Action for this role, logging-out','red');
				}
			},
			error: function(textStatus, errorThrown) 
			{
				table.ajax.reload();
				removeCredentials();
				popAlertModal("Error",'Something happened in the server, logging out','red');
			}
			

    });	  
		   
		
};


var returnandtakeBooks=function(action,theRentalID,theBookID){	
		if(checkMembership())
		$.ajax({
            type:"POST",
			data:{'Action':action,
				  'ID':theBookID,
				  'ID_Rental': theRentalID
				 },
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
            },
            url: "http://localhost:8080/LibraryRest/api/listBooks/takeBook",
            success: function(data) {
				table.ajax.reload();
				memberRentaltable.ajax.reload();
				popAlertModal("Success",data.queryResult,'green');
				
			},
			error: function(data,textStatus,errorThrown) 
			{
				var msg=errorThrown;
				if(errorThrown==='Bad Request')
					msg='An error ocurred in the server due to the information sent, try again';
				if(errorThrown==='Unauthorized'){
					removeCredentials();
					msg='Expired/Invalid Credentials or Action for this role, logging-out';
					}
				if(errorThrown==='Not Found')
					msg='There are no books available to take for this Title';
				popAlertModal("Error",msg,'red');
				memberRentaltable.ajax.reload();
				table.ajax.reload();
			}
    });	  
};

var setAvailability=function(theID,theVal){

	$.ajax({
            type:"POST",
			data:{
					ID: theID,
					numChange:theVal
				 },
       
            url: "http://localhost:8080/LibraryRest/api/listBooks/setAvailability",
            success: function(data) {
				setTimeout(function(){	
					popAlertModal("Success",data.queryResult,'green');
				}, 500);	
				table.ajax.reload();

			},
			error: function(data,textStatus,errorThrown) 
			{
					
				var msg=errorThrown;
				if(errorThrown==='Bad Request')
					msg='An error ocurred in the server due to the information sent, try again';
				if(errorThrown==='Unauthorized'){
					removeCredentials();
					msg='Expired/Invalid Credentials or Action for this role, logging-out';
					}
				if(errorThrown==='Not Found')
					msg='Book not found';
				setTimeout(function(){
					popAlertModal("Error",msg,'red');
				}, 500);
				table.ajax.reload();
			}
    });		
};

var updateWithoutFile=function(e){
					var formData = new FormData();


					var formURL =  "http://localhost:8080/LibraryRest/api/listBooks/updateBook";

					formData.append('ID',$(" #modal-form-id").val());
					formData.append('Title',$(" #Title").val());
					formData.append('Author',$(" #Author").val());
					formData.append('Description',$(" #Description").val());
					formData.append('Pages',0+$(" #Pages").val());
					formData.append('Cover',"");
					  $.ajax(
							 {
						url : formURL,
						type: "POST",
						data: formData,
						contentType: false,
						processData: false,
						success:function(data, textStatus, jqXHR) 
						{
							popAlertModal("Success",data.queryResult,'green');
							table.ajax.reload();
						},
						error: function(textStatus, errorThrown) 
						{

							var msg=errorThrown;
								if(errorThrown==='Bad Request')
									msg='An error ocurred in the server due to the information sent, try again';
								if(errorThrown==='Unauthorized'){
									removeCredentials();
									msg='Expired/Invalid Credentials or Action for this role, logging-out';
									}
								if(errorThrown==='Not Found')
									msg='Book not found';
								setTimeout(function(){
									popAlertModal("Error",msg,'red');
								}, 500);
								table.ajax.reload();
							}
						});
					 e.preventDefault();
					 e.stopPropagation();
};

var deleteBook=function(theID){
	
	$.ajax({
            type:"POST",
			data:{ID: theID
				 },
       
            url: "http://localhost:8080/LibraryRest/api/listBooks/removeBook",
            success: function(data) {
				setTimeout(function(){	
					popAlertModal("Success",data.queryResult,'green');
				}, 500);	
				table.ajax.reload();
				if(memberRentaltable!==undefined)
				memberRentaltable.ajax.reload();
			},
			error: function(data,textStatus,errorThrown) 
			{
					
				var msg=errorThrown;
				if(errorThrown==='Bad Request')
					msg='An error ocurred in the server due to the information sent, try again';
				if(errorThrown==='Unauthorized'){
					removeCredentials();
					msg='Expired/Invalid Credentials or Action for this role, logging-out';
					}
				if(errorThrown==='Not Found')
					msg='There are no books with this id';
				setTimeout(function(){
					popAlertModal("Error",msg,'red');
				}, 500);
				table.ajax.reload();
			}
    });	  
}


var RegisterMember=function(formData){
	console.log("Register");
	var formURL =  "http://localhost:8080/LibraryRest/api/Members/Register";						

						

						  $.ajax(
								 {
							url : formURL,
							type: "POST",
							data: formData,
							contentType: false,
							processData: false,
							success:function(data, textStatus, jqXHR) 
							{
								popAlertModal("Success",data.msg,'green');
								table.ajax.reload();
							},
							error: function(textStatus, errorThrown) 
							{
								var msg=errorThrown;
								if(errorThrown==='Bad Request')
								msg='An error ocurred in the server, Member could not be Registered';
								if(errorThrown==='error')
								msg='Forbidden action attempt';
								if(errorThrown="Forbidden")
								msg='Email is already in use';
								
								
								popAlertModal("Error",msg,'red');
								table.ajax.reload();
							}
							});

};

var LoginMember=function(formData){
	console.log("login");
						

						var formURL =  "http://localhost:8080/LibraryRest/api/Members/Login";

						

						  $.ajax(
								 {
							url : formURL,
							type: "POST",
							data: formData,
							contentType: false,
							processData: false,
							success:function(data, textStatus, jqXHR) 
							{
								setCredentials(data.token,data.role);
								//console.log(localStorage.getItem('Authorization'));
								popAlertModal("Success",data.msg,'green');
								
								if(memberRentaltable===undefined)
									memberTableInitialize();
								else
									memberRentaltable.ajax.reload();
								
								showMemberOnlyAreas();
								
								table.ajax.reload();
							},
							error: function(data,textStatus,errorThrown) 
							{
								var msg=errorThrown;
								if(errorThrown==='Bad Request')
								msg='An error ocurredin the server, try again';
								else if(errorThrown==='Not Found')
								msg='Member with matching Email and Password was not found';	
								popAlertModal("Error",msg,'red');
								table.ajax.reload();
							}
							});					 			

};


