<h1><?php echo $pokemon->getName(); ?></h1>

<p>
    Type:
    <?php echo $pokemon->getType(); ?>
</p>

<p>
    Level:
    <?php echo $pokemon->getLevel(); ?>
</p>

<a href="/?action=pokemon-index">
    Back
</a>


