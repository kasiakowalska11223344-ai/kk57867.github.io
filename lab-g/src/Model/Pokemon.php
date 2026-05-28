<?php

namespace App\Model;

use App\Service\Config;

class Pokemon
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $type = null;
    private ?int $level = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Pokemon
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Pokemon
    {
        $this->name = $name;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): Pokemon
    {
        $this->type = $type;

        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(?int $level): Pokemon
    {
        $this->level = $level;

        return $this;
    }

    public static function fromArray($array): Pokemon
    {
        $pokemon = new self();
        $pokemon->fill($array);

        return $pokemon;
    }

    public function fill($array): Pokemon
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }

        if (isset($array['name'])) {
            $this->setName($array['name']);
        }

        if (isset($array['type'])) {
            $this->setType($array['type']);
        }

        if (isset($array['level'])) {
            $this->setLevel($array['level']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(
            Config::get('db_dsn'),
            Config::get('db_user'),
            Config::get('db_pass')
        );

        $sql = 'SELECT * FROM pokemon';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $pokemonList = [];
        $pokemonArray = $statement->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($pokemonArray as $pokemon) {
            $pokemonList[] = self::fromArray($pokemon);
        }

        return $pokemonList;
    }

    public static function find($id): ?Pokemon
    {
        $pdo = new \PDO(
            Config::get('db_dsn'),
            Config::get('db_user'),
            Config::get('db_pass')
        );

        $sql = 'SELECT * FROM pokemon WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'id' => $id
        ]);

        $pokemonArray = $statement->fetch(\PDO::FETCH_ASSOC);

        if (! $pokemonArray) {
            return null;
        }

        return self::fromArray($pokemonArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(
            Config::get('db_dsn'),
            Config::get('db_user'),
            Config::get('db_pass')
        );

        if (! $this->getId()) {

            $sql = "INSERT INTO pokemon (name, type, level)
                    VALUES (:name, :type, :level)";

            $statement = $pdo->prepare($sql);

            $statement->execute([
                'name' => $this->getName(),
                'type' => $this->getType(),
                'level' => $this->getLevel(),
            ]);

            $this->setId($pdo->lastInsertId());

        } else {

            $sql = "UPDATE pokemon
                    SET name = :name,
                        type = :type,
                        level = :level
                    WHERE id = :id";

            $statement = $pdo->prepare($sql);

            $statement->execute([
                'name' => $this->getName(),
                'type' => $this->getType(),
                'level' => $this->getLevel(),
                'id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(
            Config::get('db_dsn'),
            Config::get('db_user'),
            Config::get('db_pass')
        );

        $sql = "DELETE FROM pokemon WHERE id = :id";

        $statement = $pdo->prepare($sql);

        $statement->execute([
            'id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setType(null);
        $this->setLevel(null);
    }
}
