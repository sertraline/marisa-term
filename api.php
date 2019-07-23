<?php
    if(isset($_POST['req']) && isset($_POST['args'])) {
        switch($_POST['req']) {
            case "host":
            $host = $_POST['args'];
            $host = preg_replace('#^https?://#', '', rtrim($host,'/'));
            if(strpos($host, "/")) {
                $host = substr($host, 0, strpos($host, "/"));
            }
            $ip = gethostbyname($host);
            echo $ip;
        }
    }

    else echo "hello";
?>