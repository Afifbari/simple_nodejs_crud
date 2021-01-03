import React, {
	useState,
	useEffect,
	useRef,
	useContext,
} from "react";
import Moment from "react-moment";
// import App from "./App";
import { UserContext } from "./UserContext";

const url = "http://localhost:5000/getAll";

const Users = () => {
	const { names, setNames } = useContext(UserContext);

	const updateInput = useRef(null);
	const editSection = useRef(null);
	const updateButton = useRef(null);

	const loadNames = async () => {
		const res = await fetch(url);
		const data = await res.json();

		setNames(data["data"]);
	};

	const deleteName = (id) => {
		fetch("http://localhost:5000/delete/" + id, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then((data) => console.log(data));

		let newNames = names.filter((name) => name.id !== id);
		setNames(newNames);
	};

	const editName = (id) => {
		editSection.current.hidden = !editSection.current.hidden;
		updateInput.current.dataset.id = id;
		updateButton.current.dataset.id = id;

		updateInput.current.focus();
	};

	const updateName = () => {
		fetch("http://localhost:5000/update", {
			headers: {
				"Content-type": "application/json",
			},
			method: "PATCH",
			body: JSON.stringify({
				id: updateInput.current.dataset.id,
				name: updateInput.current.value,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					console.log(data);

					let newNames = [...names];

					newNames.map((user) =>
						user.id == updateInput.current.dataset.id
							? (user.name = updateInput.current.value)
							: (user.name = user.name)
					);

					setNames(newNames);
					editSection.current.hidden = !editSection.current.hidden;
					updateInput.current.value = "";
				}
			});
	};

	useEffect(() => {
		loadNames();
	}, []);

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Date Added</th>
						<th>Delete</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody>
					{names.length === 0 ? (
						<tr>
							<td className="no-data" colSpan="5">
								No Data
							</td>
						</tr>
					) : (
						names.map(({ id, name, date_added }) => (
							<tr key={id}>
								<td>{id}</td>
								<td>{name}</td>
								<td>
									<Moment format="D/MM/YYYY hh:mm A">
										{date_added}
									</Moment>
								</td>
								<td>
									<button
										className="delete-row-btn"
										data-id={id}
										onClick={() => deleteName(id)}
									>
										Delete
									</button>
								</td>
								<td>
									<button
										className="edit-row-btn"
										data-id={id}
										onClick={() => editName(id)}
									>
										Edit
									</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			<section hidden ref={editSection}>
				<label>Name </label>
				<input type="text" id="update-name-input" ref={updateInput} />
				<button
					id="update-row-btn"
					onClick={updateName}
					ref={updateButton}
				>
					Update
				</button>
			</section>
		</>
	);
};

export default Users;
