<?php

if (!empty($_FILES))
{
$file_src = 'video/'.$_FILES['image']['name'];
if(move_uploaded_file($_FILES['image']['tmp_name'], $file_src)):
echo 'Your file has been uploaded sucessfully';
else:
echo 'Error';
endif;
	
	
	
	/*$target_path = "../videos/";
    $target_path = $target_path . basename( $_FILES['file']['name']);   
    if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
    echo "The file ".  basename( $_FILES['file']['name']). 
    " has been uploaded to ".$target_path;
    $data = "The file ".  basename( $_FILES['file']['name'])." has been uploaded to ".$target_path;
    $my_file = "log.txt";
            $handle = fopen($my_file, 'w') or die('Cannot open file:  '.$my_file);
            fwrite($handle, $data);
            fclose($handle); 
    } else{
        echo "There was an error uploading the file, please try again!";
    }*/
	
	
}
?>