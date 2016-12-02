
 
$(document).ready(function() {
	
	//Datatable Creation
    table= $('#example').DataTable( {
        "ajax": {
            "url": BASE_API_URL+BOOKS_API_EXTENSION,
            "type": "GET",
			error: function(data,textStatus,errorThrown){
				var msg=errorThrown;
				memberRentaltable.clear().draw();
				
				popAlertModal("Error","An error ocurred during the table load: "+msg,'red');
			}
        }, 
	   "searching": true,
        "columns": [
			{ "data": "id" },
            { "data": "Title" },
            { "data": "Author" },
            { "data": "Pages" },
			{ "data": "Cover","orderable": false },
			{ "data": "Availability","orderable": false,"searchable": false },
			{ "data": null ,"searchable": false, "orderable": false,
			"defaultContent": "<span class='glyphicon glyphicon-open' aria-hidden='true' data-column='Take'></span>"},
			{ "data": null ,"searchable": false, "orderable": false,
			"defaultContent": " <span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>"},
			{ "data": null ,"searchable": false, "orderable": false,
			"defaultContent": "<span class='glyphicon glyphicon-trash' aria-hidden='true'></span>"},
			{ "data": null ,"searchable": false, "orderable": false,
			"defaultContent": "<span class='glyphicon glyphicon-th-large' aria-hidden='true'></span>"}
			
			
        ]

    } );

    //Datatable, enabling multi-column search (not compatible with datatables scrolling functionality)
    $('#example tfoot th').each( function () {

        var title = $(this).text();
        $(this).html( '<input type="text" class="form-control" placeholder="Search '+title+'" />' );
    } );
 

 
    // Apply the search
    table.columns().every( function () {
        var that = this;
        $('input', this.footer() ).on( 'keyup change', function () {
           if ( that.search() !== this.value ) {
                that.search( this.value ).draw();
            }
        });
    } );
	
	setRestrictedElementsVisibility("Visitor");
	
});

