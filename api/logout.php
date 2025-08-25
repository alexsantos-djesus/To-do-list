<?php
require __DIR__ . '/lib.php';
json_header();
$_SESSION = array();
if (session_id() != '' || isset($_COOKIE[session_name()])) {
  setcookie(session_name(), '', time()-42000, '/');
}
session_destroy();
echo json_encode(array('ok'=>true));
