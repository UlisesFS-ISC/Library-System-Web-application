

//Prevent dropzone autodiscover
Dropzone.autoDiscover = false;	
	

 $(document).ready(function(){
/* -----------------------------------------DROPZONE handler*/
// The configuration of our dropzone div 
	 
	 myDropzone = new Dropzone("#uploadme", {
                url: "http://localhost:8080/LibraryRest/api/listBooks/newBook",
                dictDefaultMessage: "Drag the Cover",
                clickable: true,
                enqueueForUpload: false,
                maxFiles: 1,
                uploadMultiple: false,
                addRemoveLinks: true,
				autoProcessQueue: false,
				acceptedFiles: "image/jpeg,image/png,image/gif",
				accept: function(file, done) {
					done();
				  },
				init: function() {
					var newFilename;
					this.on("processing", function(file) {
						
					});
					//Actions after adding a file, checks for the quantity of items, the file type and the extension
					//A validation trigger occurs when adding a file
					this.on("addedfile", function(file) {
						newFilename=generateNewName(file.name);
						$(" #Cover").val(newFilename);
						if (this.files[1]!=null){
							alert("You can not upload more than one image, Cover will be overwritten");
							this.removeFile(this.files[0]);
						}
						
						var fileExtension=getFileExtension(file.name);
						if(fileExtension!=="jpg" && fileExtension!=="png" && fileExtension!=="gif")
						{
							alert("Please upload a valid png, gif or jpg image for yor cover");
							this.removeFile(this.files[0]);
						}
						if(allFilled("books") && coverSelected()){
							$('#newbookform').removeAttr('disabled');
						}
						else
							$('#newbookform').attr('disabled', 'disabled');
						
					});
					
					//disables the button when removing a file
					this.on("removedfile", function(file) {
							$(" #Cover").val('');
							$('#newbookform').attr('disabled', 'disabled');
					});
					
					//prepares the data to be sent
					this.on('sending', function(file, xhr, formData){
							console.log($(".dropzone-submit").attr('id'));
							xhr.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
							formData.append('ID',$(" #modal-form-id").val());
							formData.append('Title',$(" #Title").val());
							formData.append('Author',$(" #Author").val());
							formData.append('Description',$(" #Description").val());
							formData.append('Pages',0+$(" #Pages").val());
							formData.append('Cover',newFilename);
							
						});
					//Reloads the table and prints a message
					this.on("success", function(file, responseText) {
						popAlertModal("Success",responseText.queryResult,'green');
    					table.ajax.reload();
					});
					this.on("error", function(file, response) {
						if(response==="Invalid JSON response from server.")
							popAlertModal("Error","Action could not be performed due to either wrong data sent or invalid credentials",'red');
					});
						//verifies the action to perform, an Update or an Insertion
						$("#newbookform").click(function(e){
							if($(".dropzone-submit").attr('id')==='updatebookform'){
							myDropzone.options.url = "http://localhost:8080/LibraryRest/api/listBooks/updateBook";
							if(!coverSelected()){
								updateWithoutFile(e);
							}	
							 
						}
							else
							myDropzone.options.url = "http://localhost:8080/LibraryRest/api/listBooks/newBook";
							$('#myModal').modal('toggle');
							table.ajax.reload();
							e.preventDefault();
							e.stopPropagation();
							myDropzone.processQueue(); // Tell Dropzone to process all queued files.
						});

			  }
		
        			
    				
	});

	  
});