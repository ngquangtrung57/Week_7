<?php
require_once __DIR__ . '/../includes/db.php';

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../menu.php');
    exit;
}

$javaQuantity = filter_input(INPUT_POST, 'java-quantity', FILTER_VALIDATE_INT) ?? 0;
$javaSubtotal = filter_input(INPUT_POST, 'java-subtotal', FILTER_VALIDATE_FLOAT) ?? 0.00;

$cafeQuantity = filter_input(INPUT_POST, 'cafe-quantity', FILTER_VALIDATE_INT) ?? 0;
$cafeSubtotal = filter_input(INPUT_POST, 'cafe-subtotal', FILTER_VALIDATE_FLOAT) ?? 0.00;
$cafeType = filter_input(INPUT_POST, 'cafe-type', FILTER_DEFAULT);

$cappuccinoQuantity = filter_input(INPUT_POST, 'cappuccino-quantity', FILTER_VALIDATE_INT) ?? 0;
$cappuccinoSubtotal = filter_input(INPUT_POST, 'cappuccino-subtotal', FILTER_VALIDATE_FLOAT) ?? 0.00;
$cappuccinoType = filter_input(INPUT_POST, 'cappuccino-type', FILTER_DEFAULT);

$totalPrice = filter_input(INPUT_POST, 'total-price', FILTER_VALIDATE_FLOAT) ?? 0.00;

if ($cafeQuantity <= 0) {
    $cafeType = null;
}
if ($cappuccinoQuantity <= 0) {
    $cappuccinoType = null;
}

if ($totalPrice <= 0) {
    die('Error: Order cannot be empty.');
}

try {
    $sql = "INSERT INTO orders (
                java_quantity, java_subtotal,
                cafe_type, cafe_quantity, cafe_subtotal,
                cappuccino_type, cappuccino_quantity, cappuccino_subtotal,
                total_price
            ) VALUES (
                :java_quantity, :java_subtotal,
                :cafe_type, :cafe_quantity, :cafe_subtotal,
                :cappuccino_type, :cappuccino_quantity, :cappuccino_subtotal,
                :total_price
            )";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':java_quantity'       => $javaQuantity,
        ':java_subtotal'       => $javaSubtotal,
        ':cafe_type'           => $cafeType,
        ':cafe_quantity'       => $cafeQuantity,
        ':cafe_subtotal'       => $cafeSubtotal,
        ':cappuccino_type'     => $cappuccinoType,
        ':cappuccino_quantity' => $cappuccinoQuantity,
        ':cappuccino_subtotal' => $cappuccinoSubtotal,
        ':total_price'         => $totalPrice,
    ]);

    $orderId = $pdo->lastInsertId();

} catch (PDOException $e) {
    error_log('Database Insert Error: ' . $e->getMessage());
    die('Failed to process order. Please try again later.');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JavaJam Coffee House - Order Confirmation</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
<div class="page">
    <header>
        <h1>JavaJam Coffee House</h1>
    </header>
    <div class="content-wrapper">
        <main>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your order. Your order reference number is <strong>#<?= htmlspecialchars($orderId) ?></strong>.</p>
            
            <table class="menu-table">
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
                <?php if ($javaQuantity > 0): ?>
                <tr>
                    <td>Just Java</td>
                    <td><?= $javaQuantity ?></td>
                    <td>$<?= number_format($javaSubtotal, 2) ?></td>
                </tr>
                <?php endif; ?>
                <?php if ($cafeQuantity > 0): ?>
                <tr>
                    <td>Cafe au Lait</td>
                    <td><?= $cafeQuantity ?></td>
                    <td>$<?= number_format($cafeSubtotal, 2) ?></td>
                </tr>
                <?php endif; ?>
                <?php if ($cappuccinoQuantity > 0): ?>
                <tr>
                    <td>Iced Cappuccino</td>
                    <td><?= $cappuccinoQuantity ?></td>
                    <td>$<?= number_format($cappuccinoSubtotal, 2) ?></td>
                </tr>
                <?php endif; ?>
                <tr>
                    <th colspan="2">Total Paid</th>
                    <td><strong>$<?= number_format($totalPrice, 2) ?></strong></td>
                </tr>
            </table>

            <p><a href="../menu.php">Return to Menu</a></p>
        </main>
    </div>
</div>
</body>
</html>