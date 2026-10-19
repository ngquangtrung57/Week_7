<?php
// actions/process_price_update.php
require_once __DIR__ . '/../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../admin/update-menu.php');
    exit;
}

try {
    // 1. Get current prices to preserve untouched items
    $stmt = $pdo->query("SELECT * FROM menus ORDER BY id DESC LIMIT 1");
    $current = $stmt->fetch();

    // 2. Read new inputs or fall back to existing stored values
    $java             = isset($_POST['java']) ? (float)$_POST['java'] : (float)$current['java'];
    $cafeSingle       = isset($_POST['cafe_single']) ? (float)$_POST['cafe_single'] : (float)$current['cafe_single'];
    $cafeDouble       = isset($_POST['cafe_double']) ? (float)$_POST['cafe_double'] : (float)$current['cafe_double'];
    $cappuccinoSingle = isset($_POST['cappuccino_single']) ? (float)$_POST['cappuccino_single'] : (float)$current['cappuccino_single'];
    $cappuccinoDouble = isset($_POST['cappuccino_double']) ? (float)$_POST['cappuccino_double'] : (float)$current['cappuccino_double'];

    // 3. Update the existing row (or INSERT INTO menus to maintain full change history)
    $sql = "UPDATE menus 
            SET java = :java,
                cafe_single = :cafe_single,
                cafe_double = :cafe_double,
                cappuccino_single = :cappuccino_single,
                cappuccino_double = :cappuccino_double,
                updated_at = NOW()
            WHERE id = :id";

    $updateStmt = $pdo->prepare($sql);
    $updateStmt->execute([
        ':java'              => $java,
        ':cafe_single'       => $cafeSingle,
        ':cafe_double'       => $cafeDouble,
        ':cappuccino_single' => $cappuccinoSingle,
        ':cappuccino_double' => $cappuccinoDouble,
        ':id'                => $current['id']
    ]);

    header('Location: ../admin/update-menu.php?status=success');
    exit;

} catch (PDOException $e) {
    error_log("Update Menu Error: " . $e->getMessage());
    die('Failed to update prices. Please try again.');
}