<?php
header('Access-Control-Allow-Origin: *');
 
$location = $_POST['directory'];
$uploadfile = $_POST['fileName'];
$uploadfilename = $_FILES['file']['tmp_name'];
 
if(move_uploaded_file($uploadfilename, $location.'/'.$uploadfile)){
        echo 'File successfully uploaded!';
} else {
        echo 'Upload error!';
}
?>


<?php
if(!isset($_FILES['file']) || ($_FILES['file']['tmp_name'] == ''))
        echo "Please choose a file.";
    else {
        $uploadfile =  $_FILES['file']['name'];
        $uploadfilename = $_FILES['file']['tmp_name'];  
    }
$location = 'images/';
if(move_uploaded_file($uploadfilename, $location.$uploadfile)){
echo 'File uploaded..';
} else {
echo 'Error to upload..';
}
?>