import sqlite3

conn = sqlite3.connect("pokemon.db")

conn.execute("""
INSERT INTO pokemon(name, type, level)
VALUES
('Pikachu', 'Electric', 25)
""")

conn.commit()
conn.close()

print("Dodano Pokemona")