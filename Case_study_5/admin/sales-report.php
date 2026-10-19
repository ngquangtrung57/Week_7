<?php
// admin/sales_report.php
require_once __DIR__ . '/../includes/db.php';

$reportData = null;
$reportGeneratedAt = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['generate_report'])) {
    $reportGeneratedAt = date('Y-m-d H:i:s');

    try {
        // Fetch all orders for report calculation
        $stmt = $pdo->query("SELECT * FROM orders");
        $orders = $stmt->fetchAll();

        // Initialize sales metrics structure
        $products = [
            'java' => [
                'name' => 'Just Java',
                'quantity' => 0,
                'subtotal' => 0.00,
                'has_shots' => false,
                'single_qty' => 0,
                'double_qty' => 0
            ],
            'cafe' => [
                'name' => 'Cafe au Lait',
                'quantity' => 0,
                'subtotal' => 0.00,
                'has_shots' => true,
                'single_qty' => 0,
                'double_qty' => 0
            ],
            'cappuccino' => [
                'name' => 'Iced Cappuccino',
                'quantity' => 0,
                'subtotal' => 0.00,
                'has_shots' => true,
                'single_qty' => 0,
                'double_qty' => 0
            ]
        ];

        $grandTotalRevenue = 0.00;
        $grandTotalQuantity = 0;

        // Process order history
        foreach ($orders as $order) {
            // Just Java
            $pQty = (int)$order['java_quantity'];
            $pSub = (float)$order['java_subtotal'];
            $products['java']['quantity'] += $pQty;
            $products['java']['subtotal'] += $pSub;

            // Cafe au Lait
            $cQty = (int)$order['cafe_quantity'];
            $cSub = (float)$order['cafe_subtotal'];
            $products['cafe']['quantity'] += $cQty;
            $products['cafe']['subtotal'] += $cSub;
            if ($order['cafe_type'] === 'Single') {
                $products['cafe']['single_qty'] += $cQty;
            } elseif ($order['cafe_type'] === 'Double') {
                $products['cafe']['double_qty'] += $cQty;
            }

            // Iced Cappuccino
            $capQty = (int)$order['cappuccino_quantity'];
            $capSub = (float)$order['cappuccino_subtotal'];
            $products['cappuccino']['quantity'] += $capQty;
            $products['cappuccino']['subtotal'] += $capSub;
            if ($order['cappuccino_type'] === 'Single') {
                $products['cappuccino']['single_qty'] += $capQty;
            } elseif ($order['cappuccino_type'] === 'Double') {
                $products['cappuccino']['double_qty'] += $capQty;
            }

            $grandTotalRevenue += (float)$order['total_price'];
        }

        // Determine best-selling product by total quantity sold
        $bestSellingKey = null;
        $maxQty = -1;

        foreach ($products as $key => $data) {
            $grandTotalQuantity += $data['quantity'];
            if ($data['quantity'] > $maxQty) {
                $maxQty = $data['quantity'];
                $bestSellingKey = $key;
            }
        }

        $bestProduct = $products[$bestSellingKey] ?? null;
        $popularOption = 'N/A';

        if ($bestProduct && $bestProduct['quantity'] > 0) {
            if (!$bestProduct['has_shots']) {
                $popularOption = 'Fixed Option (Endless Cup)';
            } else {
                if ($bestProduct['single_qty'] > $bestProduct['double_qty']) {
                    $popularOption = 'Single Shot';
                } elseif ($bestProduct['double_qty'] > $bestProduct['single_qty']) {
                    $popularOption = 'Double Shot';
                } else {
                    $popularOption = 'Tied between Single and Double Shots';
                }
            }
        }

        $reportData = [
            'products' => $products,
            'grand_revenue' => $grandTotalRevenue,
            'grand_quantity' => $grandTotalQuantity,
            'best_product' => $bestProduct,
            'popular_option' => $popularOption
        ];

    } catch (PDOException $e) {
        error_log("Sales report generation error: " . $e->getMessage());
        $errorMsg = "Failed to generate report. Please try again.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JavaJam Coffee House - Sales Report</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .report-summary-box {
            background-color: #f4f4f4;
            border-left: 4px solid #2e1c0c;
            padding: 15px;
            margin-top: 20px;
            margin-bottom: 25px;
        }
        .report-summary-box h3 { margin-top: 0; }
        .meta-timestamp {
            font-style: italic;
            color: #666;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
<div class="page">
    <header>
        <h1>JavaJam Admin - Sales Reporting</h1>
    </header>
    <div class="content-wrapper">
        <nav>
            <a href="../index.html">Home</a>
            <a href="../menu.php">Menu</a>
            <a href="../music.html">Music</a>
            <a href="../jobs.html">Jobs</a>
            <a href="update-menu.php">Product Price Update</a>
            <a href="sales-report.php" class="active">Sales Report Generate</a>
        </nav>
        <main>
            <h2>Product Sales Report Generator</h2>
            
            <form action="sales-report.php" method="POST">
                <button type="submit" name="generate_report" class="menu-button">Generate Report</button>
            </form>

            <?php if (isset($errorMsg)): ?>
                <p style="color: red;"><?= htmlspecialchars($errorMsg) ?></p>
            <?php endif; ?>

            <?php if ($reportData): ?>
                <div class="meta-timestamp">
                    <strong>Report Timestamp:</strong> <?= htmlspecialchars($reportGeneratedAt) ?>
                </div>

                <!-- Highlight Box for Best Seller & Popular Option -->
                <div class="report-summary-box">
                    <h3>Key Insights</h3>
                    <?php if ($reportData['best_product'] && $reportData['best_product']['quantity'] > 0): ?>
                        <p><strong>Best-Selling Product:</strong> <?= htmlspecialchars($reportData['best_product']['name']) ?> (<?= $reportData['best_product']['quantity'] ?> units sold)</p>
                        <p><strong>Most Popular Category Option:</strong> <?= htmlspecialchars($reportData['popular_option']) ?></p>
                    <?php else: ?>
                        <p>No sales records found to evaluate top performers.</p>
                    <?php endif; ?>
                </div>

                <!-- Product Sales Table -->
                <table class="menu-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity Sold</th>
                            <th>Total Sales ($)</th>
                            <th>Single Shot Qty</th>
                            <th>Double Shot Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($reportData['products'] as $prod): ?>
                        <tr>
                            <td><strong><?= htmlspecialchars($prod['name']) ?></strong></td>
                            <td><?= $prod['quantity'] ?></td>
                            <td>$<?= number_format($prod['subtotal'], 2) ?></td>
                            <td><?= $prod['has_shots'] ? $prod['single_qty'] : '—' ?></td>
                            <td><?= $prod['has_shots'] ? $prod['double_qty'] : '—' ?></td>
                        </tr>
                        <?php endforeach; ?>
                        <tr>
                            <th>Grand Totals</th>
                            <th><?= $reportData['grand_quantity'] ?></th>
                            <th>$<?= number_format($reportData['grand_revenue'], 2) ?></th>
                            <th colspan="2"></th>
                        </tr>
                    </tbody>
                </table>
            <?php endif; ?>
        </main>
    </div>
</div>
</body>
</html>