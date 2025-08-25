<?php
// api/lib.php — funções utilitárias (compatível com PHP < 8)
if (session_status() === PHP_SESSION_NONE) { session_start(); }

function json_header(){
  header('Content-Type: application/json; charset=utf-8');
}

function base_dir(){
  return dirname(__FILE__); // /api
}

function data_users_dir(){
  $dir = dirname(__FILE__) . '/../data/users';
  if (!is_dir($dir)) { @mkdir($dir, 0777, true); }
  return realpath($dir) ?: $dir;
}

function sanitize_user($raw){
  $u = strtolower($raw);
  $u = preg_replace('/[^a-z0-9_]/', '', $u);
  if (!$u) return '';
  if (strlen($u) > 32) $u = substr($u, 0, 32);
  return $u;
}

function current_user(){
  return isset($_SESSION['USER']) ? $_SESSION['USER'] : '';
}

function ensure_user_table($user){
  $user = sanitize_user($user);
  if (!$user) return false;
  $p = data_users_dir() . '/' . $user . '.json';
  if (!file_exists($p)) {
    file_put_contents($p, '[]', LOCK_EX);
  }
  return $p;
}

function read_user_tasks($user){
  $user = sanitize_user($user);
  if (!$user) return array();
  $p = ensure_user_table($user);
  $s = @file_get_contents($p);
  if ($s === false || $s === '') return array();
  $arr = json_decode($s, true);
  if (!is_array($arr)) $arr = array();
  // garantir owner correto
  for ($i=0; $i<count($arr); $i++){
    if (!isset($arr[$i]['owner'])) $arr[$i]['owner'] = $user;
  }
  return $arr;
}

function write_user_tasks($user, $arr){
  $user = sanitize_user($user);
  if (!$user) return false;
  $p = ensure_user_table($user);
  $json = json_encode($arr);
  return file_put_contents($p, $json, LOCK_EX) !== false;
}

function list_all_tasks(){
  $dir = data_users_dir();
  $items = array();
  $files = glob($dir . '/*.json');
  if ($files) {
    foreach ($files as $f){
      $user = basename($f, '.json');
      $s = @file_get_contents($f);
      if ($s === false) continue;
      $arr = json_decode($s, true);
      if (!is_array($arr)) continue;
      foreach ($arr as $it){
        if (!isset($it['owner'])) $it['owner'] = $user;
        $items[] = $it;
      }
    }
  }
  // ordenar do mais recente para o mais antigo, se tiver 'created'
  usort($items, function($a,$b){
    $ta = isset($a['created']) ? $a['created'] : 0;
    $tb = isset($b['created']) ? $b['created'] : 0;
    if ($ta == $tb) return 0;
    return ($ta > $tb) ? -1 : 1;
  });
  return $items;
}

function uid(){
  // compatível com PHP antigo
  return uniqid('t', true);
}
