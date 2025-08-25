<?php
require __DIR__ . '/lib.php';
json_header();
$me = current_user();
if (!$me) { http_response_code(401); echo json_encode(array('ok'=>false,'error'=>'NOT_LOGGED')); exit; }
$id = isset($_POST['id']) ? $_POST['id'] : '';
if ($id === '') { http_response_code(400); echo json_encode(array('ok'=>false,'error'=>'NO_ID')); exit; }

$items = read_user_tasks($me);
$before = count($items);
$items = array_values(array_filter($items, function($it) use ($id){
  return !isset($it['id']) || $it['id'] !== $id;
}));
$after = count($items);

if ($before === $after) { http_response_code(403); echo json_encode(array('ok'=>false,'error'=>'PERMISSION_DENIED')); exit; }
write_user_tasks($me, $items);
echo json_encode(array('ok'=>true));
