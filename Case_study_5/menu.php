<?php
// menu.php
require_once __DIR__ . '/includes/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM menus ORDER BY id DESC LIMIT 1");
    $menu = $stmt->fetch();
} catch (PDOException $e) {
    error_log("Failed to fetch menu: " . $e->getMessage());
    $menu = [
        'java' => 2.00,
        'cafe_single' => 2.00,
        'cafe_double' => 3.00,
        'cappuccino_single' => 4.75,
        'cappuccino_double' => 5.75
    ];
}

function formatPrice($price) {
    return number_format((float)$price, 2);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>JavaJam Coffee House - Menu</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="page">
<header>
    <h1>JavaJam Coffee House</h1>
</header>
<div class="content-wrapper">
    <nav>
        <a href="index.html">Home</a>
        <a href="menu.php" class="active">Menu</a>
        <a href="music.html">Music</a>
        <a href="jobs.html">Jobs</a>
        <a href="admin/update-menu.php">Product Price Update</a>
        <a href="admin/sales-report.php">Sales Report Generate</a>
    </nav>
    <main>
        <h2>Coffee at JavaJam</h2>
        <form id="menu-form" action="actions/checkout.php" method="POST">
            <table class="menu-table">
                <!-- Just Java -->
                <tr>
                    <th>Just Java</th>
                    <td>Regular house blend, decaffeinated coffee, or flavor of the day.<br>
                        <strong>Endless Cup $<?= formatPrice($menu['java']) ?></strong>
                    </td>
                    <td>Quantity: <input type="text" class="quantity" name="java-quantity" value="0"></td>
                    <td>Subtotal: <input type="text" class="subtotal" name="java-subtotal" readonly></td>
                </tr>

                <!-- Cafe au Lait -->
                <tr>
                    <th>Cafe au Lait</th>
                    <td>House blended coffee infused into a smooth, steamed milk.<br>
                        <input type="radio" name="cafe-price" value="<?= $menu['cafe_single'] ?>" data-type="Single">
                        Single $<?= formatPrice($menu['cafe_single']) ?><br>
                        
                        <input type="radio" name="cafe-price" value="<?= $menu['cafe_double'] ?>" data-type="Double">
                        Double $<?= formatPrice($menu['cafe_double']) ?><br>
                        
                        <input type="hidden" name="cafe-type" id="cafe-type" value="">
                    </td>
                    <td>Quantity: <input type="text" class="quantity" name="cafe-quantity" value="0"></td>
                    <td>Subtotal: <input type="text" class="subtotal" name="cafe-subtotal" readonly></td>
                </tr>

                <!-- Iced Cappuccino -->
                <tr>
                    <th>Iced Cappuccino</th>
                    <td>Sweetened espresso blended with icy-cold milk and served in a chilled glass.<br>
                        <input type="radio" name="cappuccino-price" value="<?= $menu['cappuccino_single'] ?>" data-type="Single">
                        Single $<?= formatPrice($menu['cappuccino_single']) ?><br>
                        
                        <input type="radio" name="cappuccino-price" value="<?= $menu['cappuccino_double'] ?>" data-type="Double">
                        Double $<?= formatPrice($menu['cappuccino_double']) ?><br>
                        
                        <input type="hidden" name="cappuccino-type" id="cappuccino-type" value="">
                    </td>
                    <td>Quantity: <input type="text" class="quantity" name="cappuccino-quantity" value="0"></td>
                    <td>Subtotal: <input type="text" class="subtotal" name="cappuccino-subtotal" readonly></td>
                </tr>

                <!-- Total -->
                <tr>
                    <th></th>
                    <td id="total-price">Total price:</td>
                    <td colspan="2"><input type="text" class="total" name="total-price" readonly></td>
                </tr>
            </table>
            <p id="form-message"></p>
            <button type="submit" class="menu-button">Check-out</button>
        </form>
    </main>
</div>
<footer>
    <small><i>Copyright &copy; 2014 JavaJam Coffee House<br>
        <a href="mailto:trung@nguyen.com">trung@nguyen.com</a></i></small>
</footer>
</div>
<script type="text/javascript" src="MenuUpdate.js" defer></script>
</body>
</html>