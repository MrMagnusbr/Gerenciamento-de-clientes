<?php
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$dataFile = 'data.json';

if ($method === 'GET') {
    // Retorna o conteúdo do arquivo data.json
    if (file_exists($dataFile)) {
        $data = file_get_contents($dataFile);
        echo $data;
    } else {
        echo json_encode([]);
    }
} elseif ($method === 'POST') {
    $input = file_get_contents("php://input");
    $userData = json_decode($input, true);

    // Verifica se todos os campos necessários estão presentes
    if (!isset($userData['nome']) || !isset($userData['cpf']) || !isset($userData['endereco']) || !isset($userData['anotacoes'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }

    // Carrega os dados existentes, se houver
    $existingData = [];
    if (file_exists($dataFile)) {
        $existingData = json_decode(file_get_contents($dataFile), true);
    }

    // Verifica se já existe um cliente com o mesmo CPF
    foreach ($existingData as $cliente) {
        if ($cliente['cpf'] === $userData['cpf']) {
            http_response_code(409); // Conflito, cliente já existe
            echo json_encode(['error' => 'Cliente já cadastrado']);
            exit;
        }
    }

    // Adiciona o novo cliente aos dados existentes
    $existingData[] = $userData;

    // Salva os dados atualizados no arquivo JSON
    file_put_contents($dataFile, json_encode($existingData, JSON_PRETTY_PRINT));

    // Retorna uma mensagem de sucesso
    echo json_encode(['success' => true]);

} elseif ($method === 'PUT') {
    // Obtém os dados do corpo da requisição
    $input = file_get_contents("php://input");
    $putData = json_decode($input, true);

    // Obtém o CPF do cliente a ser editado
    $cpf = $putData['cpf'];

    // Carrega os dados existentes
    $existingData = [];
    if (file_exists($dataFile)) {
        $existingData = json_decode(file_get_contents($dataFile), true);
    }

    // Verifica se o cliente com o CPF especificado existe e atualiza seus dados
    $found = false;
    foreach ($existingData as $key => $cliente) {
        if ($cliente['cpf'] === $cpf) {
            // Atualiza os dados do cliente com os novos dados recebidos, se forem definidos
            if (isset($putData['nome'])) {
                $existingData[$key]['nome'] = $putData['nome'];
            }
            if (isset($putData['endereco'])) {
                $existingData[$key]['endereco'] = $putData['endereco'];
            }
            if (isset($putData['anotacoes'])) {
                $existingData[$key]['anotacoes'] = $putData['anotacoes'];
            }
            $found = true;
            break;
        }
    }

    if ($found) {
        // Salva os dados atualizados no arquivo JSON
        file_put_contents($dataFile, json_encode($existingData, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Cliente não encontrado']);
    }

}elseif ($method === 'DELETE') {
    // Obtém o CPF do cliente a ser deletado do corpo da requisição
    $input = file_get_contents("php://input");
    $deleteData = json_decode($input, true);
    $cpf = $deleteData['cpf'];

    // Carrega os dados existentes
    $existingData = [];
    if (file_exists($dataFile)) {
        $existingData = json_decode(file_get_contents($dataFile), true);
    }

    // Verifica se o cliente com o CPF especificado existe e o remove
    $found = false;
    foreach ($existingData as $key => $cliente) {
        if ($cliente['cpf'] === $cpf) {
            unset($existingData[$key]);
            $found = true;
            break;
        }
    }

    if ($found) {
        // Salva os dados atualizados no arquivo JSON
        file_put_contents($dataFile, json_encode(array_values($existingData), JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Cliente não encontrado']);
    }

} else {
    // Se o método não for GET, POST, PUT ou DELETE, retorna método não permitido
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
