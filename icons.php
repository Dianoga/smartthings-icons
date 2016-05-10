<?php

$iconUrl = 'https://graph.api.smartthings.com/api/devices/icons/';

header('Content-type', 'application/json');

echo file_get_contents($iconUrl);