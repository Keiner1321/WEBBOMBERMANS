<?php
$host = '127.0.0.1';
$port = 3306;
$db   = 'bomberosdb';
$user = 'root';
$pass = '';

$mysqli = new mysqli($host, $user, $pass, $db, $port);
if ($mysqli->connect_errno) {
    die("Conexión fallida: ({$mysqli->connect_errno}) {$mysqli->connect_error}");
}

// Helper: indicar respuesta JSON para peticiones AJAX
function respond_json($data) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Sanear entrada simple
function get_post($key) {
    if (!isset($_POST[$key])) return null;
    return trim($_POST[$key]);
}

// Extraer sólo la sigla del tipo de documento (ej: 'Cédula de Ciudadanía (CC)' -> 'CC')
function normalize_document_type($value) {
    // Si ya viene en formato CC/TI/CE, devolver directamente en mayúsculas
    $v = strtoupper(trim($value));
    if (in_array($v, ['CC','TI','CE'])) return $v;

    // Intentar extraer lo que está entre paréntesis
    if (preg_match('/\(([^)]+)\)/', $value, $m)) {
        return strtoupper(trim($m[1]));
    }

    // Fallback: tomar las primeras 2 letras
    return substr($v, 0, 2);
}

/* ====== CREAR ASPIRANTE ====== */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['nombres'])) {
    // Recolectar y sanear campos
    $nombre = get_post('nombres');
    $apellido = get_post('apellido');
    $document_type_raw = get_post('document_type');
    $document_type = normalize_document_type($document_type_raw);
    $numero_documento = get_post('document_number');
    $telefono = get_post('phone');
    $correo = get_post('email');
    $fecha_nacimiento = get_post('birth_date');
    $genero = get_post('gender');
    $genero_tipo = get_post('other_gender') ?: null;
    $direccion = get_post('address');

    // Validaciones básicas
    $errors = [];
    if ($nombre === null || $nombre === '') $errors[] = 'El nombre es obligatorio.';
    if ($apellido === null || $apellido === '') $errors[] = 'El apellido es obligatorio.';
    if ($document_type === null || !in_array($document_type, ['CC','TI','CE'])) $errors[] = 'Tipo de documento inválido.';
    if ($numero_documento === null || $numero_documento === '') $errors[] = 'Número de documento obligatorio.';
    if ($telefono === null || $telefono === '') $errors[] = 'Teléfono obligatorio.';
    if ($correo === null || $correo === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) $errors[] = 'Correo inválido.';
    if ($fecha_nacimiento === null || $fecha_nacimiento === '') $errors[] = 'Fecha de nacimiento obligatoria.';
    if ($genero === null || $genero === '') $errors[] = 'Género obligatorio.';
    if ($genero === 'otro' && ($genero_tipo === null || $genero_tipo === '')) $errors[] = 'Debe especificar su género.';

    // Si la petición viene por AJAX responder JSON
    $is_ajax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
    if (!empty($errors)) {
        if ($is_ajax) respond_json(['success' => false, 'message' => implode(' ', $errors), 'errors' => $errors]);
        // Si no es AJAX, mostrar errores simples
        echo "<p style='color:red;'>" . implode('<br>', $errors) . "</p>";
    } else {
        $sql = "INSERT INTO aspirantes (nombre, apellidos, tipo_documento, numero_documento, telefono, correo, fecha_nacimiento, genero, genero_tipo, direccion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($sql);
        if (!$stmt) {
            $msg = 'Error en la preparación de la consulta: ' . $mysqli->error;
            if ($is_ajax) respond_json(['success' => false, 'message' => $msg]);
            echo "<p style='color:red;'>$msg</p>";
        } else {
            // Forzar todos como strings (s) porque la BD espera varchar
            $tipo_doc = (string)$document_type;
            $stmt->bind_param("ssssssssss", 
                $nombre, 
                $apellido, 
                $tipo_doc, 
                $numero_documento, 
                $telefono, 
                $correo, 
                $fecha_nacimiento, 
                $genero, 
                $genero_tipo,
                $direccion
            );
            $exec = $stmt->execute();
            if ($is_ajax) {
                if ($exec) respond_json(['success' => true, 'message' => 'Aspirante creado correctamente.']);
                else respond_json(['success' => false, 'message' => 'Error al guardar: ' . $stmt->error]);
            } else {
                if ($exec) echo "<p style='color:green;'>✅ Aspirante creado correctamente.</p>";
                else echo "<p style='color:red;'>Error al guardar: " . $stmt->error . "</p>";
            }
        }
    }
}

/* ====== ELIMINAR ASPIRANTE ====== */
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    $sql = "DELETE FROM aspirantes WHERE id_usuario = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo "<p style='color:red;'>🗑️ Aspirante eliminado correctamente.</p>";
}

/* ====== ACTUALIZAR ASPIRANTE ====== */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update'])) {
    $sql = "UPDATE aspirantes SET 
                nombre=?, apellidos=?, tipo_documento=?, numero_documento=?, telefono=?, correo=?, 
                fecha_nacimiento=?, genero=?, genero_tipo=?, direccion=?
            WHERE id_usuario=?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ssssssssssi", 
        $_POST['nombre'], 
        $_POST['apellidos'], 
        $_POST['tipo_documento'], 
        $_POST['numero_documento'], 
        $_POST['telefono'], 
        $_POST['correo'], 
        $_POST['fecha_nacimiento'], 
        $_POST['genero'], 
        $_POST['genero_tipo'], 
        $_POST['direccion'],
        $_POST['id_usuario']
    );
    $stmt->execute();
    echo "<p style='color:blue;'>✏️ Aspirante actualizado correctamente.</p>";
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Aspirantes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background: #f4f4f4; }
        a { text-decoration: none; margin: 0 5px; }
        .edit { color: blue; }
        .delete { color: red; }
    </style>
    <script>
        function confirmarEliminacion(id) {
            if (confirm("⚠️ ¿Estás seguro de eliminar este aspirante?")) {
                window.location.href = "db.php?delete=" + id;
            }
        }
    </script>
</head>
<body>

<h2>Lista de Aspirantes</h2>
<table>
    <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Documento</th>
        <th>Teléfono</th>
        <th>Correo</th>
        <th>Nacimiento</th>
        <th>Género</th>
        <th>Dirección</th>
        <th>Acciones</th>
    </tr>
    <?php
    $result = $mysqli->query("SELECT * FROM aspirantes");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<tr>
                    <td>{$row['id_usuario']}</td>
                    <td>{$row['nombre']} {$row['apellidos']}</td>
                    <td>{$row['tipo_documento']} {$row['numero_documento']}</td>
                    <td>{$row['telefono']}</td>
                    <td>{$row['correo']}</td>
                    <td>{$row['fecha_nacimiento']}</td>
                    <td>{$row['genero']} {$row['genero_tipo']}</td>
                    <td>{$row['direccion']}</td>
                    <td>
                        <a href='db.php?edit={$row['id_usuario']}' class='edit'><i class='fa-solid fa-pen'></i></a>
                        <a href='#' onclick='confirmarEliminacion({$row['id_usuario']})' class='delete'><i class='fa-solid fa-trash'></i></a>
                    </td>
                  </tr>";
        }
    } else {
        echo "<tr><td colspan='9'>No hay aspirantes registrados.</td></tr>";
    }
    ?>
</table>

<?php
// FORMULARIO DE EDICIÓN
if (isset($_GET['edit'])) {
    $id = intval($_GET['edit']);
    $res = $mysqli->query("SELECT * FROM aspirantes WHERE id_usuario = $id");
    $aspirante = $res->fetch_assoc();
    ?>
    <h2>Editar Aspirante</h2>
    <form method="POST">
        <input type="hidden" name="id_usuario" value="<?= $aspirante['id_usuario'] ?>">
        <input type="text" name="nombre" value="<?= $aspirante['nombre'] ?>" required>
        <input type="text" name="apellidos" value="<?= $aspirante['apellidos'] ?>" required>
        <input type="text" name="tipo_documento" value="<?= $aspirante['tipo_documento'] ?>" required>
        <input type="text" name="numero_documento" value="<?= $aspirante['numero_documento'] ?>" required>
        <input type="text" name="telefono" value="<?= $aspirante['telefono'] ?>" required>
        <input type="email" name="correo" value="<?= $aspirante['correo'] ?>" required>
        <input type="date" name="fecha_nacimiento" value="<?= $aspirante['fecha_nacimiento'] ?>" required>
        <input type="text" name="genero" value="<?= $aspirante['genero'] ?>" required>
        <input type="text" name="genero_tipo" value="<?= $aspirante['genero_tipo'] ?>">
        <input type="text" name="direccion" value="<?= $aspirante['direccion'] ?>" required>
        <button type="submit" name="update">Actualizar</button>
    </form>
    <?php
}
$mysqli->close();
?>
</body>
</html>
