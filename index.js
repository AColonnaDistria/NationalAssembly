var URL = "http://localhost:5000";
var URL_files = `${URL}/files`;

var sieges = []
var data;

var partyList = [{"name": "NFP", "numberOfSeats": 191, "color": "#ff0000"},
                 {"name": "ENS", "numberOfSeats": 156, "color": "#ffeb00"},
                 {"name": "LR", "numberOfSeats": 66, "color": "#0066cc"},
                 {"name": "RN", "numberOfSeats": 143, "color": "#0000b8"}]

var colorOthers = "gray";
var partyTable = document.getElementById("party_table");

await makeSieges(document.getElementById("assembly"));
updatePartyTable();

function updateSeats() {
    for (let siegeNumber = 0; siegeNumber < sieges.length; ++siegeNumber) {
        let siege = sieges[siegeNumber];

        siege.style.backgroundColor = getColorOfSeat(siegeNumber);
    }
}

function getColorOfSeat(seatNumber) {
    let count = 0;
    for (let party of partyList) {
        count += party.numberOfSeats;

        if (count > seatNumber) {
            return party.color;
        }
    }

    return colorOthers;
}

async function makeSiege(gh, X, Y, color) {
    let circle = document.createElement("div");
    let radius = 10.0;

    circle.style.position = "fixed";
    circle.style.borderRadius = `${radius}px`;
    circle.style.top = `${X}px`;
    circle.style.left = `${Y}px`;
    circle.style.width = `${radius * 2.0}px`;
    circle.style.height = `${radius * 2.0}px`;
    circle.style.backgroundColor = color;

    gh.appendChild(circle);

    return circle;
}

async function makeSieges(gh) {
    let W = 3600.0;
    let H = 1850.0;

    let Wout = 1200.0;
    let Hout = 616.0;

    let response = await fetch(`${URL_files}/french-assembly-data.csv`);
    data = await response.text();

    let lines = data.split('\n');
    for (let i = 1; i < lines.length; ++i) {
        let line = lines[i];
        let fields = line.split(',');

        let X = parseFloat(fields[0]) / W * Wout;
        let Y = parseFloat(fields[1]) / H * Hout;

        sieges.push(await makeSiege(gh, X, Y, getColorOfSeat(i - 1)));
    }
}

function makePartyTableCell() {
    let table_cell = document.createElement("td");
    table_cell.style.border = "1px solid gray"
    table_cell.style.borderCollapse = "collapse"

    return table_cell;
}

function makePartyTableAddRow() {
    let table_row = document.createElement("tr");

    table_row.appendChild(document.createElement("td"));
    table_row.appendChild(document.createElement("td"));
    table_row.appendChild(document.createElement("td"));

    let table_row_add_button = makePartyTableRowAddButton(0);

    table_row.appendChild(table_row_add_button);

    return table_row;
}

function makePartyTableRow(id, party) {
    let table_row = document.createElement("tr");

    let table_row_name = makePartyTableRowName(party.name);
    let table_row_number_of_seats = makePartyTableRowNumberOfSeats(id, party.numberOfSeats);
    let table_row_color = makePartyTableRowColor(id, party.color);
    let table_row_delete_button = makePartyTableRowDeleteButton(id);

    table_row.appendChild(table_row_name);
    table_row.appendChild(table_row_number_of_seats);
    table_row.appendChild(table_row_color);
    table_row.appendChild(table_row_delete_button);
    
    return table_row;
}

function makePartyTableRowAddButton(id) {
    let table_row_button = document.createElement("button");
    table_row_button.textContent = "+";

    table_row_button.style.border = "0";
    table_row_button.style.boxShadow = "none";
    table_row_button.style.borderRadius = "10px";

    table_row_button.style.marginLeft = "3px";
    table_row_button.style.marginTop = "3px";
    table_row_button.style.marginBottom = "3px";

    table_row_button.style.width = "4em";
    table_row_button.style.height = "3em";
    table_row_button.style.backgroundColor = "green";
    table_row_button.style.color = "white";

    table_row_button.style.fontWeight = "bold";

    table_row_button.addEventListener("click", (event) => {
        partyList.push({name: "Party name", numberOfSeats: 0, color: "#008000"});
        updatePartyTable();
        //updateSeats();
    });

    return table_row_button;
}

function makePartyTableRowDeleteButton(id) {
    let table_row_button = document.createElement("button");
    table_row_button.textContent = "x";

    table_row_button.style.border = "0";
    table_row_button.style.boxShadow = "none";
    table_row_button.style.borderRadius = "10px";

    table_row_button.style.marginLeft = "3px";
    table_row_button.style.marginTop = "3px";
    table_row_button.style.marginBottom = "3px";

    table_row_button.style.width = "4em";
    table_row_button.style.height = "3em";
    table_row_button.style.backgroundColor = "red";
    table_row_button.style.color = "white";

    table_row_button.style.fontWeight = "bold";

    table_row_button.addEventListener("click", (event) => {
        partyList.splice(id, 1);
        updatePartyTable();
        updateSeats();
    });

    return table_row_button;
}

function makePartyTableRowName(name) {
    let table_row_name = makePartyTableCell();

    let table_row_name_input = document.createElement("input");

    table_row_name_input.setAttribute("type", "text");
    table_row_name_input.value = name;
    table_row_name_input.style.width = "8em";

    table_row_name_input.style.textAlign = "center";
    table_row_name_input.style.display = "block";
    table_row_name_input.style.marginLeft = "auto";
    table_row_name_input.style.marginRight = "auto";

    table_row_name.appendChild(table_row_name_input);

    return table_row_name;
}

function makePartyTableRowNumberOfSeats(id, numberOfSeats) {
    let table_row_number_of_seats = makePartyTableCell();

    let table_row_number_of_seats_selector = document.createElement("input");
    table_row_number_of_seats_selector.setAttribute("type", "number");
    table_row_number_of_seats_selector.valueAsNumber = numberOfSeats;
    table_row_number_of_seats_selector.min = 0;
    table_row_number_of_seats_selector.max = sieges.length;

    table_row_number_of_seats_selector.style.textAlign = "center";
    table_row_number_of_seats_selector.style.display = "block";
    table_row_number_of_seats_selector.style.marginLeft = "auto";
    table_row_number_of_seats_selector.style.marginRight = "auto";

    table_row_number_of_seats_selector.addEventListener("input", (event) => {
        let newNumberOfSeats = event.target.valueAsNumber;

        partyList[id].numberOfSeats = newNumberOfSeats;
        updateSeats();
    });

    table_row_number_of_seats.appendChild(table_row_number_of_seats_selector);

    return table_row_number_of_seats;
}

function makePartyTableRowColor(id, color) {
    let table_row_color = makePartyTableCell();

    let table_row_color_input = document.createElement("input");
    table_row_color_input.setAttribute("type", "color");
    table_row_color_input.value = color;

    table_row_color_input.style.display = "block";
    table_row_color_input.style.marginLeft = "auto";
    table_row_color_input.style.marginRight = "auto";

    table_row_color_input.addEventListener("input", (event) => {
        let newColor = event.target.value;

        partyList[id].color = newColor;
        updateSeats();
    });

    table_row_color.appendChild(table_row_color_input);

    return table_row_color;
}

function clearPartyTable() {
    partyTable.innerHTML = ""; // Clears party table
}

function updatePartyTable() {
    clearPartyTable();

    let table_head = document.createElement("tr");
    let columns = ["Name", "Number of seats", "Color"];

    for (let col of columns) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(col));
        
        th.style.border = "solid 1px gray";

        table_head.appendChild(th);
    }
    table_head.appendChild(document.createElement("th"));


    partyTable.appendChild(table_head);

    for (let id = 0; id < partyList.length; ++id) {
        let party = partyList[id];

        let partyRow = makePartyTableRow(id, party);
        partyTable.appendChild(partyRow);
    }

    partyTable.appendChild(makePartyTableAddRow());
}
