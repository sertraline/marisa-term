<?php
    if(isset($_POST['req']) && isset($_POST['args'])) {
        switch($_POST['req']) {
            case "host":
            $host = $_POST['args'];
            $ip = gethostbyname($host);
            echo $ip;
        }
    }

    else echo "hello";
?>