<?php /** @var $pokemon ?\App\Model\Pokemon */ ?>

<div class="form-group">

    <label>Name</label>

    <input
            type="text"
            name="pokemon[name]"
            value="<?php echo $pokemon ? $pokemon->getName() : ''; ?>"
    >

</div>

<div class="form-group">

    <label>Type</label>

    <input
            type="text"
            name="pokemon[type]"
            value="<?php echo $pokemon ? $pokemon->getType() : ''; ?>"
    >

</div>

<div class="form-group">

    <label>Level</label>

    <input
            type="number"
            name="pokemon[level]"
            value="<?php echo $pokemon ? $pokemon->getLevel() : ''; ?>"
    >

</div>

<div class="form-group">

    <input type="submit" value="Save">

</div>
