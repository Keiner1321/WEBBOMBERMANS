<?php
// Conexión a MySQL
$servername = "localhost";
$username = "root";  // usuario por defecto en XAMPP
$password = "";      // por defecto está vacío
$database = "bomberosbd";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

// Consulta SQL
$sql = "SELECT id_usuario, cargo, nombre, apellidos, correo FROM usuarios";
$result = $conn->query($sql);

// Mostrar datos en tabla HTML
echo "<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <title>Usuarios Bomberos</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
    h1 { color: #b30000; }
    table { width: 80%; border-collapse: collapse; margin: 20px auto; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
    th { background: #b30000; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
  </style>
</head>
<body>
  <h1>Lista de Usuarios</h1>
  <table>
    <tr>
      <th>ID</th>
      <th>Cargo</th>
      <th>Nombre</th>
      <th>Apellidos</th>
      <th>Correo</th>
    </tr>";

// Mostrar filas si hay resultados
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>".$row["id_usuario"]."</td>
                <td>".$row["cargo"]."</td>
                <td>".$row["nombre"]."</td>
                <td>".$row["apellidos"]."</td>
                <td>".$row["correo"]."</td>
              </tr>";
    }
} else {
    echo "<tr><td colspan='5'>No hay usuarios registrados</td></tr>";
}

echo "</table>
</body>
</html>";

$conn->close();
?>