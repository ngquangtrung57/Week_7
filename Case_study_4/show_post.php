<!DOCTYPE html>
<html lang="en">
<head>
    <title>JavaJam Coffee House - Application Received</title>
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
        <a href="menu.html">Menu</a>
        <a href="music.html">Music</a>
        <a href="jobs.html" class="active">Jobs</a>
    </nav>
    <main>
        <h2>Thank You for Applying</h2>
        <p>We received the following information (submitted via POST):</p>
        <table class="menu-table">
            <tr>
                <th>Name</th>
                <td><?php echo htmlspecialchars($_POST['name'] ?? ''); ?></td>
            </tr>
            <tr>
                <th>E-mail</th>
                <td><?php echo htmlspecialchars($_POST['email'] ?? ''); ?></td>
            </tr>
            <tr>
                <th>Start Date</th>
                <td><?php echo htmlspecialchars($_POST['startdate'] ?? ''); ?></td>
            </tr>
            <tr>
                <th>Experience</th>
                <td><?php echo htmlspecialchars($_POST['experience'] ?? ''); ?></td>
            </tr>
        </table>
    </main>
</div>
<footer>
    <small><i>Copyright &copy; 2014 JavaJam Coffee House<br>
        <a href="mailto:trung@nguyen.com">trung@nguyen.com</a></i></small>
</footer>
</div>
</body>
</html>
