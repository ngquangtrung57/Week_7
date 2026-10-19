<?php
require_once __DIR__ . '/../includes/db.php';

try {
    // Fetch the latest menu prices record
    $stmt = $pdo->query("SELECT * FROM menus ORDER BY id DESC LIMIT 1");
    $current = $stmt->fetch();
} catch (PDOException $e) {
    error_log("Failed to fetch menu: " . $e->getMessage());
    $current = [
        'java' => 2.00,
        'cafe_single' => 2.00,
        'cafe_double' => 3.00,
        'cappuccino_single' => 4.75,
        'cappuccino_double' => 5.75,
        'updated_at' => 'N/A'
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JavaJam Coffee House - Admin Update Menu</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .update-table input[type="number"] { width: 90px; }
    </style>
</head>
<body>
<div class="page">
    <header><h1>JavaJam Admin - Price Manager</h1></header>
    <div class="content-wrapper">
        <nav>
            <a href="../index.html">Home</a>
            <a href="../menu.php">Menu</a>
            <a href="../music.html">Music</a>
            <a href="../jobs.html">Jobs</a>
            <a href="update-menu.php" class="active">Product Price Update</a>
            <a href="sales-report.php">Sales Report Generate</a>
        </nav>
        <main>
            <h2>Update Coffee Blend Prices</h2>
            <p><small>Last Menu Update: <?= htmlspecialchars($current['updated_at']) ?></small></p>
            <form action="../actions/price-update.php" method="POST">
                <table class="menu-table update-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Coffee Blend</th>
                            <th>Fixed Price ($)</th>
                            <th>Single Shot ($)</th>
                            <th>Double Shot ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Just Java -->
                        <tr>
                            <td>
                                <input type="checkbox" onchange="toggleInputs(this)">
                            </td>
                            <td><strong>Just Java</strong></td>
                            <td>
                                <input type="number" step="0.01" min="0" name="java" 
                                       value="<?= number_format($current['java'], 2) ?>" disabled required>
                            </td>
                            <td>—</td>
                            <td>—</td>
                        </tr>
                        <!-- Cafe au Lait -->
                        <tr>
                            <td>
                                <input type="checkbox" onchange="toggleInputs(this)">
                            </td>
                            <td><strong>Cafe au Lait</strong></td>
                            <td>—</td>
                            <td>
                                <input type="number" step="0.01" min="0" name="cafe_single" 
                                       value="<?= number_format($current['cafe_single'], 2) ?>" disabled required>
                            </td>
                            <td>
                                <input type="number" step="0.01" min="0" name="cafe_double" 
                                       value="<?= number_format($current['cafe_double'], 2) ?>" disabled required>
                            </td>
                        </tr>
                        <!-- Iced Cappuccino -->
                        <tr>
                            <td>
                                <input type="checkbox" onchange="toggleInputs(this)">
                            </td>
                            <td><strong>Iced Cappuccino</strong></td>
                            <td>—</td>
                            <td>
                                <input type="number" step="0.01" min="0" name="cappuccino_single" 
                                       value="<?= number_format($current['cappuccino_single'], 2) ?>" disabled required>
                            </td>
                            <td>
                                <input type="number" step="0.01" min="0" name="cappuccino_double" 
                                       value="<?= number_format($current['cappuccino_double'], 2) ?>" disabled required>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br>
                <button type="submit" class="menu-button">Save All Prices into Row</button>
            </form>
        </main>
    </div>
</div>

<script>
function toggleInputs(checkbox) {
    const row = checkbox.closest('tr');
    const inputs = row.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.disabled = !checkbox.checked;
    });
}
</script>
</body>
</html>