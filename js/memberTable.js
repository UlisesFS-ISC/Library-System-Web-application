
$(document).ready(function() {
  memberTableInitialize=function(){

    memberRentaltable= $('#memberTable').DataTable( {
        "ajax": {
            "url": BASE_API_URL+MEMBERS_API_EXTENSION+"/getMemberTable",
            "type": "GET",
			'beforeSend': function (request) {
        		request.setRequestHeader("Authorization", localStorage.getItem('Authorization'));
			},
			error: function(data,textStatus,errorThrown){
				console.log(errorThrown);
				var msg=errorThrown;
				memberRentaltable.clear().draw();
				if(errorThrown==="Unauthorized"){
					removeCredentials();
					msg='Expired/Invalid Credentials or Action for this role, logging-out';
				}
				if(errorThrown=="Not Found")
					msg='Logged-In. No Rental data found for this Member';
				setTimeout(function(){
						$('#alertModal').modal('toggle');	
				}, 1000);
				setTimeout(function(){
						popAlertModal("Error",msg,'red');
				}, 2000);
				
				
			}
        }, 
	   "searching": true,
        "columns": [
			{ "data": "ID_Rental" },
            { "data": "ID_Book" },
            { "data": "Title" },
            { "data": "RentalDate" },
			{ "data": "Cover","orderable": false,"searchable": false},
			{ "data": "DeadLine" },
			{ "data": null ,"searchable": false, "orderable": false,
			"defaultContent": "<span class='glyphicon glyphicon-save' aria-hidden='true'></span>"}
			
        ]

    } );
	

	
	
    //Datatable, enabling multi-column search (not compatible with datatables scrolling functionality)
    $('#memberTable tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" class="form-control" placeholder="Search '+title+'" />' );
    } );
 

 
    // Apply the search
    memberRentaltable.columns().every( function () {
        var that = this;
        $('input', this.footer() ).on( 'keyup change', function () {
           if ( that.search() !== this.value ) {
                that.search( this.value ).draw();
            }
        });
    } );

}
  

  


});

