let gameFinished = false;

window.addEventListener("load", () => {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
});

let map = null;
let marker = null;
let savedCanvas = null;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.debug("Brak geolokalizacji");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    if (!map) {
        map = L.map('puzzle1').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OSM'
        }).addTo(map);
    }

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lon]).addTo(map);

    map.setView([lat, lon], 13);

    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function MojaLokalizacja() {
    resetGame();
    getLocation();
}

function PobierzMape() {
    if (!map) {
        alert("Najpierw kliknij 'Moja lokalizacja'");
        return;
    }

    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error(err);
            return;
        }

        savedCanvas = canvas;

        const container = document.getElementById("puzzle1");
        container.innerHTML = "";
        container.appendChild(canvas);

        generatePuzzleFromCanvas(canvas);
        generatePreview(canvas);
    });
}

const pieces = document.querySelectorAll("[draggable=true]");
const drops = document.querySelectorAll("td");

pieces.forEach(el => {
    el.addEventListener("dragstart", drag);
});

drops.forEach(el => {
    el.addEventListener("dragover", allowDrop);
    el.addEventListener("drop", drop);
});

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    e.dataTransfer.setData("text", e.target.id);
}

function drop(e) {
    e.preventDefault();

    let target = e.target;

    while (target && target.tagName !== "TD") {
        target = target.parentElement;
    }

    if (!target) return;
    if (target.children.length > 0) return;

    const id = e.dataTransfer.getData("text");
    const element = document.getElementById(id);

    target.appendChild(element);

    checkWin();
}

function checkWin() {
    if (gameFinished) return;

    let ok = true;

    document.querySelectorAll(".puzzle2 td").forEach(td => {
        const piece = td.firstElementChild;

        if (!piece) {
            ok = false;
            return;
        }

        const correct = piece.dataset.correct;

        if (td.id !== correct) {
            ok = false;
        }
    });

    if (ok) {
        gameFinished = true;
        alert("Brawo! Ułożyłeś puzzle!");
        showNotification();
    }
}

function generatePuzzleFromCanvas(canvas) {
    const size = 80;
    let index = 0;

    document.querySelectorAll("[draggable=true]").forEach(el => {
        const x = (index % 4) * size;
        const y = Math.floor(index / 4) * size;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = size;
        tempCanvas.height = size;

        const ctx = tempCanvas.getContext("2d");

        ctx.drawImage(
            canvas,
            x, y, size, size,
            0, 0, size, size
        );

        const dataURL = tempCanvas.toDataURL();

        el.style.backgroundImage = `url(${dataURL})`;
        el.style.backgroundSize = "80px 80px";

        index++;
    });

}

function generatePreview(canvas) {
    const size = 80;
    let index = 0;

    const cells = document.querySelectorAll(".puzzle3 td");

    cells.forEach(cell => {
        const x = (index % 4) * size;
        const y = Math.floor(index / 4) * size;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = size;
        tempCanvas.height = size;

        const ctx = tempCanvas.getContext("2d");

        ctx.drawImage(
            canvas,
            x, y, size, size,
            0, 0, size, size
        );

        const img = document.createElement("img");
        img.src = tempCanvas.toDataURL();
        img.width = 80;
        img.height = 80;

        cell.innerHTML = "";
        cell.appendChild(img);

        index++;
    });
}

function resetGame() {

    gameFinished = false;

    if (map) {
        map.remove();
        map = null;
        marker = null;
    }

    document.querySelectorAll(".puzzle2 td").forEach(td => {
        td.innerHTML = "";
    });

    document.querySelectorAll(".puzzle3 td").forEach(td => {
        td.innerHTML = "";
    });

    const container = document.querySelector(".stol-left");

    document.querySelectorAll("[draggable=true]").forEach(el => {
        container.appendChild(el);
        el.style.backgroundImage = "";
        el.style.backgroundSize = "";
    });

}

function showNotification() {
    if (!("Notification" in window)) {
        alert("Twoja przeglądarka nie obsługuje powiadomień");
        return;
    }

    if (Notification.permission === "granted") {
        new Notification("Brawo! Ułożyłeś puzzle!");
    } else {
        alert("Zgoda na powiadomienia nie została udzielona.");
    }
}
