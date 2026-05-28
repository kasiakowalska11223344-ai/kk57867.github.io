<?php

namespace App\Controller;

use App\Model\Pokemon;
use App\Service\Router;
use App\Service\Templating;

class PokemonController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $pokemon = Pokemon::findAll();

        return $templating->render('pokemon/index.html.php', [
            'pokemon' => $pokemon,
            'router' => $router,
        ]);
    }

    public function showAction(
        int $id,
        Templating $templating,
        Router $router
    ): ?string {

        $pokemon = Pokemon::find($id);

        return $templating->render('pokemon/show.html.php', [
            'pokemon' => $pokemon,
            'router' => $router,
        ]);
    }

    public function createAction(
        ?array $requestPokemon,
        Templating $templating,
        Router $router
    ): ?string {

        if ($requestPokemon) {

            $pokemon = new Pokemon();
            $pokemon->fill($requestPokemon);
            $pokemon->save();

            header('Location: /?action=pokemon-index');
            exit;
        }

        return $templating->render('pokemon/create.html.php', [
            'router' => $router,
        ]);
    }

    public function editAction(
        int $id,
        ?array $requestPokemon,
        Templating $templating,
        Router $router
    ): ?string {

        $pokemon = Pokemon::find($id);

        if ($requestPokemon) {

            $pokemon->fill($requestPokemon);
            $pokemon->save();

            header('Location: /?action=pokemon-index');
            exit;
        }

        return $templating->render('pokemon/edit.html.php', [
            'pokemon' => $pokemon,
            'router' => $router,
        ]);
    }

    public function deleteAction(int $id): void
    {
        $pokemon = Pokemon::find($id);

        if ($pokemon) {
            $pokemon->delete();
        }

        header('Location: /?action=pokemon-index');
        exit;
    }
}
