<?php
header('Content-Type: application/json; charset=utf-8');

// Permitir solicitudes desde el mismo origen (ajustar si se necesita CORS)
// header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db.php';

$response = ['success' => false, 'message' => ''];

// Helper para limpiar entradas
function clean($v) {
    return trim($v);
}

// Obtener y validar campos mínimos
$nombre = isset($_POST['nombres']) ? clean($_POST['nombres']) : null;
$apellido = isset($_POST['apellido']) ? clean($_POST['apellido']) : null;
$document_type = isset($_POST['document_type']) ? clean($_POST['document_type']) : null;
$document_number = isset($_POST['document_number']) ? clean($_POST['document_number']) : null;
$phone = isset($_POST['phone']) ? clean($_POST['phone']) : null;
$email = isset($_POST['email']) ? clean($_POST['email']) : null;
$birth_date = isset($_POST['birth_date']) ? clean($_POST['birth_date']) : null;
$gender = isset($_POST['gender']) ? clean($_POST['gender']) : null;
$other_gender = isset($_POST['other_gender']) ? clean($_POST['other_gender']) : '';
$address = isset($_POST['address']) ? clean($_POST['address']) : null;

// Validaciones simples
if (!$nombre || !$apellido || !$document_type || !$email || !$birth_date || !$gender || !$address) {
    $response['message'] = 'Faltan campos obligatorios.';
    echo json_encode($response);
    exit;
}

// Si el usuario seleccionó 'otro', exigir que especifique el género
if ($gender === 'otro' && empty($other_gender)) {
    $response['message'] = 'Por favor especifique su género cuando seleccione "Otro".';
    echo json_encode($response);
    exit;
}

// Validación básica de correo
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'El correo proporcionado no tiene un formato válido.';
    echo json_encode($response);
    exit;
}

// Determinar valor final del genero
$final_gender = $gender === 'otro' ? $other_gender : $gender;

// Asegurar que el género no exceda la longitud de la columna (varchar(20) en la DB)
if (mb_strlen($final_gender) > 20) {
    $final_gender = mb_substr($final_gender, 0, 20);
}

// Insertar en la tabla usuarios
// Campos de la tabla: cargo, nombre, apellidos, tipo_identificacion, numero_identificacion, teléfono, correo, fecha_nacimiento, genero, especifique_genero, direccion_residencia, id_rol
// Para 'cargo' e 'id_rol' usaremos valores por defecto: 'Solicitante' y NULL

// Si no tenemos id_rol lo excluimos de la inserción para simplificar
$stmt = $conn->prepare("INSERT INTO usuarios (cargo, nombre, apellidos, tipo_identificacion, numero_identificacion, `teléfono`, correo, fecha_nacimiento, genero, especifique_genero, direccion_residencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    $response['message'] = 'Error en la preparación de la consulta: ' . $conn->error;
    echo json_encode($response);
    exit;
}

$cargo = 'Solicitante';
$id_rol = null;

// Convertir fecha a formato YYYY-MM-DD (viene ya así del input date en la mayoría de navegadores)
$fecha = $birth_date;

// Bind params: todos como strings en este formulario
$stmt->bind_param('sssssssssss', $cargo, $nombre, $apellido, $document_type, $document_number, $phone, $email, $fecha, $final_gender, $other_gender, $address);

// Nota: bind_param requiere number of types equal to params; ajustamos la consulta para evitar id_rol si es NULL

// Ejecutar con manejo de errores
try {
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Registro enviado correctamente. Gracias por unirte.';
    } else {
        // Manejo de duplicados (por ejemplo número de documento único)
        $err = $stmt->error;
        $response['message'] = 'Error guardando el registro: ' . $err;
    }
} catch (Exception $e) {
    $response['message'] = 'Excepción al guardar: ' . $e->getMessage();
}

$stmt->close();
$conn->close();

echo json_encode($response);

?>
