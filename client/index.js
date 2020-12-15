document.addEventListener("DOMContentLoaded", function () {
	fetch("http://localhost:5000/getAll")
		.then((res) => res.json())
		.then((data) => loadHTMLTable(data["data"]));
	// loadHTMLTable(data["data"]);
});

document
	.querySelector("table tbody")
	.addEventListener("click", function (event) {
		if (event.target.className === "delete-row-btn") {
			deleteRowById(event.target.dataset.id);
		}

		if (event.target.className === "edit-row-btn") {
			handdleEditRow(event.target.dataset.id);
		}
	});

const updateBtn = document.querySelector("#update-row-btn");
const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = function () {
	const searchValue = document.querySelector("#search-input").value;

	fetch("http://localhost:5000/search/" + searchValue)
		.then((res) => res.json())
		.then((data) => loadHTMLTable(data["data"]));
};

function deleteRowById(id) {
	fetch("http://localhost:5000/delete/" + id, {
		method: "DELETE",
	})
		.then((res) => res.json())
		.then((data) => {
			// console.log(data);
			if (data.success) {
				location.reload();
			}
		});
}

function handdleEditRow(id) {
	console.log(id);
	const updateSection = document.querySelector("#update-row");
	updateSection.hidden = !updateSection.hidden;
	document.querySelector("#update-row-btn").dataset.id = id;
	document.querySelector("#update-name-input").dataset.id = id;
}

updateBtn.onclick = function () {
	const updatedNameInput = document.querySelector(
		"#update-name-input"
	);

	console.log("input: " + updatedNameInput.value);

	fetch("http://localhost:5000/update", {
		headers: {
			"Content-type": "application/json",
		},
		method: "PATCH",
		body: JSON.stringify({
			id: updatedNameInput.dataset.id,
			name: updatedNameInput.value,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				location.reload();
			}
		});
};

const addBtn = document.querySelector("#add-name-btn");

addBtn.onclick = function () {
	const nameInput = document.querySelector("#name-input");
	const name = nameInput.value;
	nameInput.value = "";

	fetch("http://localhost:5000/insert", {
		headers: {
			"Content-type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({ name: name }),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
			insertRowIntoTable(data["data"]);
		});
};

function insertRowIntoTable(data) {
	const table = document.querySelector("table tbody");
	const isTableNoData = table.querySelector(".no-data");

	let tableHtml = "<tr>";

	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			if (key === "dateAdded") {
				data[key] = new Date(data[key]).toLocaleString();
			}
			tableHtml += `<td>${data[key]}</td>`;
		}
	}

	tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
	tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;
	tableHtml += "</tr>";

	if (isTableNoData) {
		table.innerHTML = tableHtml;
	} else {
		const newRow = table.insertRow();
		newRow.innerHTML = tableHtml;
	}
}

function loadHTMLTable(data) {
	const table = document.querySelector("table tbody");
	let tableHtml = "";
	if (data.length === 0) {
		table.innerHTML =
			"<tr><td class='no-data' colspan='5'>No Data</td></tr>";
		return;
	}

	console.log(data);

	data.forEach(function ({ id, name, date_added }) {
		tableHtml += "<tr>";
		tableHtml += `<td>${id}</td>`;
		tableHtml += `<td>${name}</td>`;
		tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
		tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
		tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
		tableHtml += "</tr>";
	});

	table.innerHTML = tableHtml;
}
