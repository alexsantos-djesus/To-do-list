<?php
require __DIR__ . '/lib.php';
json_header();
$me = current_user();
if (!$me) { http_response_code(401); echo json_encode(array('ok'=>false,'error'=>'NOT_LOGGED')); exit; }
$text = isset($_POST['text']) ? trim($_POST['text']) : '';
if ($text === '') { http_response_code(400); echo json_encode(array('ok'=>false,'error'=>'EMPTY')); exit; }

$items = read_user_tasks($me);
$item = array(
  'id' => uid(),
  'text' => $text,
  'done' => false,
  'owner' => $me,
  'created' => time()
);
array_unshift($items, $item);
write_user_tasks($me, $items);
echo json_encode(array('ok'=>true,'item'=>$item));
