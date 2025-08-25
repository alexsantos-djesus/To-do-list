<?php
require __DIR__ . '/lib.php';
json_header();
$view = isset($_GET['view']) ? $_GET['view'] : 'all';
$me = current_user();

if ($view === 'mine') {
  if (!$me) { echo json_encode(array('items'=>array())); exit; }
  $items = read_user_tasks($me);
  echo json_encode(array('items'=>$items));
  exit;
}

// default: all
$items = list_all_tasks();
echo json_encode(array('items'=>$items));
