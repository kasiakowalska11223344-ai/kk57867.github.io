from flask import Flask, render_template
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect("pokemon.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index():

    conn = get_db()

    pokemon = conn.execute(
        "SELECT * FROM pokemon"
    ).fetchall()

    conn.close()

    return render_template(
        "index.html",
        pokemon=pokemon
    )

from flask import Flask, render_template, request, redirect

@app.route("/create", methods=["GET", "POST"])
def create():

    if request.method == "POST":

        name = request.form["name"]
        pokemon_type = request.form["type"]
        level = request.form["level"]

        conn = get_db()

        conn.execute(
            """
            INSERT INTO pokemon(name, type, level)
            VALUES (?, ?, ?)
            """,
            (name, pokemon_type, level)
        )

        conn.commit()
        conn.close()

        return redirect("/")

    return render_template("create.html")

@app.route("/show/<int:id>")
def show(id):

    conn = get_db()

    pokemon = conn.execute(
        "SELECT * FROM pokemon WHERE id = ?",
        (id,)
    ).fetchone()

    conn.close()

    return render_template(
        "show.html",
        pokemon=pokemon
    )

@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit(id):

    conn = get_db()

    if request.method == "POST":

        name = request.form["name"]
        pokemon_type = request.form["type"]
        level = request.form["level"]

        conn.execute(
            """
            UPDATE pokemon
            SET name = ?, type = ?, level = ?
            WHERE id = ?
            """,
            (name, pokemon_type, level, id)
        )

        conn.commit()
        conn.close()

        return redirect("/")

    pokemon = conn.execute(
        "SELECT * FROM pokemon WHERE id = ?",
        (id,)
    ).fetchone()

    conn.close()

    return render_template(
        "edit.html",
        pokemon=pokemon
    )

@app.route("/delete/<int:id>")
def delete(id):

    conn = get_db()

    conn.execute(
        "DELETE FROM pokemon WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)