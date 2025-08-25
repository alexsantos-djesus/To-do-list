<?php
require __DIR__ . '/lib.php';
json_header();
echo json_encode(array('user'=>current_user()));
