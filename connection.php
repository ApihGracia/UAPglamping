<?php

if (!function_exists('load_env_file')) {
    function load_env_file($envPath)
    {
        if (!file_exists($envPath)) {
            return;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || strpos($line, '#') === 0) {
                continue;
            }

            if (strpos($line, '=') === false) {
                continue;
            }

            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            if ($key === '') {
                continue;
            }

            if (
                (strlen($value) >= 2) &&
                (($value[0] === '"' && substr($value, -1) === '"') || ($value[0] === "'" && substr($value, -1) === "'"))
            ) {
                $value = substr($value, 1, -1);
            }

            if (getenv($key) === false) {
                putenv($key . '=' . $value);
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

if (!function_exists('env_value')) {
    function env_value($key, $default = null)
    {
        $value = getenv($key);

        if ($value !== false) {
            return $value;
        }

        if (isset($_ENV[$key])) {
            return $_ENV[$key];
        }

        if (isset($_SERVER[$key])) {
            return $_SERVER[$key];
        }

        return $default;
    }
}

$envPath = __DIR__ . DIRECTORY_SEPARATOR . '.env';
load_env_file($envPath);

$host = env_value('DB_HOST', 'localhost');
$port = (int) env_value('DB_PORT', '3306');
$db = env_value('DB_NAME', 'uap_glamping');
$user = env_value('DB_USER', 'root');
$pass = env_value('DB_PASS', '');

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die('Fail to connect with Database: ' . $conn->connect_error);
}

?>
