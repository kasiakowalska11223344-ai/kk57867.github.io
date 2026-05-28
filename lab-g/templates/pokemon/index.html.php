<h1>Pokemon list</h1>

<a href="/?action=pokemon-create">
    Create new pokemon
</a>

<?php foreach ($pokemon as $poke): ?>

    <div>

        <h3>
            <?php echo $poke->getName(); ?>
        </h3>

        <p>
            Type:
            <?php echo $poke->getType(); ?>
        </p>

        <p>
            Level:
            <?php echo $poke->getLevel(); ?>
        </p>

        <a href="/?action=pokemon-show&id=<?php echo $poke->getId(); ?>">
            Show
        </a>

        <a href="/?action=pokemon-edit&id=<?php echo $poke->getId(); ?>">
            Edit
        </a>

        <a href="/?action=pokemon-delete&id=<?php echo $poke->getId(); ?>">
            Delete
        </a>

    </div>

    <hr>

<?php endforeach; ?>
