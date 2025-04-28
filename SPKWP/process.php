<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $weights = $input['weights'];
    $criteriaType = $input['criteriaType'];
    $alternatives = $input['alternatives'];
    
    // Validasi total bobot
    $totalWeight = array_sum(array_values($weights));
    if (abs($totalWeight - 1) > 0.001) {
        echo json_encode(['error' => "Total bobot harus 1. Saat ini total bobot: $totalWeight"]);
        exit;
    }
    
    // Hitung weighted product
    $S_values = [];
    foreach ($alternatives as $alt) {
        $S = 1;
        foreach ($weights as $criteria => $weight) {
            $value = $alt[$criteria];
            if ($criteriaType[$criteria] === 'benefit') {
                $S *= pow($value, $weight);
            } else { // cost
                $S *= pow($value, -$weight);
            }
        }
        $S_values[$alt['name']] = $S;
    }
    
    // Hitung total S
    $total_S = array_sum($S_values);
    
    // Hitung vektor V (nilai preferensi)
    $V_values = [];
    foreach ($S_values as $altName => $S) {
        $V_values[$altName] = $S / $total_S;
    }
    
    // Urutkan hasil
    arsort($V_values);
    
    echo json_encode([
        'results' => $V_values,
        'best_alternative' => array_key_first($V_values)
    ]);
} else {
    echo json_encode(['error' => 'Metode request tidak valid']);
}
?>