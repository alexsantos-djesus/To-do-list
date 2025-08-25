<?php
require __DIR__ . '/lib.php';
json_header();
$me = current_user();
if (!$me) { http_response_code(401); echo json_encode(array('ok'=>false,'error'=>'NOT_LOGGED')); exit; }
ensure_user_table($me);
echo json_encode(array('ok'=>true));
