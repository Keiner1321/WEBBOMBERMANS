<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bomberosbd"; // Asegúrate de que este sea el nombre correcto

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Establecer el charset a utf8mb4 para soportar caracteres especiales (acentos, ñ)
$conn->set_charset("utf8mb4");

// Verificar si la conexión falló y detener la ejecución si es así
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>