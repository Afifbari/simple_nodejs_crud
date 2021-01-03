import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import Table from "./Users";

import "./App.css";

function App() {
	/****************************************************/
	// Here all the event handlers for Buttons are present
	const [names, setNames] = useState([]);

	const addNameHandler = () => {
		console.log(document.getElementById("name-input").value);

		const nameInputField = document.getElementById("name-input");
		const name = nameInputField.value;
		nameInputField.value = "";

		fetch("http://localhost:5000/insert", {
			headers: {
				"Content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({ name: name }),
		})
			.then((res) => {
				console.log(res);
				return res.json();
			})
			.then((data) => {
				setNames([...names, data["data"]]);
				console.log(data);
			});
	};

	/**************************************************/
	// Here all the event handlers for Table is present

	return (
		<>
			<main>
				<label>Name:</label>
				<input type="text" id="name-input" />
				<button id="add-name-btn" onClick={addNameHandler}>
					Add Name
				</button>

				<br />
				<br />

				<div>
					<input placeholder="search by name" id="search-input" />
					<button id="search-btn">Search</button>
				</div>

				<UserContext.Provider value={{ names, setNames }}>
					<Table />
				</UserContext.Provider>
			</main>
		</>
	);
}

export default App;
