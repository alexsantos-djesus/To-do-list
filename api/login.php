<?php
require __DIR__ . '/lib.php';
json_header();
$user = isset($_POST['user']) ? $_POST['user'] : '';
$user = sanitize_user($user);
if (!$user) { http_response_code(400); echo json_encode(array('ok'=>false,'error'=>'INVALID_USER')); exit; }
$_SESSION['USER'] = $user;
ensure_user_table($user);
echo json_encode(array('ok'=>true,'user'=>$user));
