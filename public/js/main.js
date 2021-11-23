/*
// 1. Lấy danh sách hiện có
// 2. Thêm cv
3. Sửa cv
// 4. Xóa cv
5. Lọc cv theo trạng thái
// 6. Thay đổi trạng thái 
*/
// Truy cập thành phần
const todo_listEl = document.querySelector(".todo-list");
const todo_inputEl = document.querySelector("#todo-input");
const todo_editInputEl = document.querySelector("#edit-input");
const todo_editIndexEl = document.querySelector("#edit-id");
const todo_btnAddEl = document.querySelector("#btn-add");
const todo_btnEditEl = document.querySelector("#btn-edit");
const todo_addDivEl = document.querySelector(".todo-div");
const todo_editDivEl = document.querySelector(".edit-div");
const radio_all = document.querySelector("#all");
const radio_unactive = document.querySelector("#unactive");
const radio_active = document.querySelector("#active");
// Khai báo biến
let todos = [];
let disableRadio = false;
let listStatus = `all`;
function createID() {
	return Math.floor(Math.random() * 100000);
}

// API Function
// Lấy danh sách todo

// Get Todo

function getTodosAPI() {
	return axios.get("/todos"); // => Luôn trả về promise
}

// Post Todos

function postTodosAPI(titleTodo) {
	return axios.post("/todos", {
		id: createID(),
		title: titleTodo,
		status: false,
	});
}

//Delete Todo

function deleteTodosAPI(id) {
	return axios({
		method: `delete`,
		url: `/todos/${id}`,
	});
}

// Patch Todo - Status

function patchStatusTodosAPI(id, statusInput) {
	return axios.patch(`/todos/${id}`, {
		status: statusInput,
	});
}

// Patch Todo - Title

function patchTitleTodosAPI(id, titleInput) {
	return axios.patch(`/todos/${id}`, {
		title: titleInput,
	});
}

// Website function
// Get Todos
async function getTodos() {
	try {
		const res = await getTodosAPI();
		todos = res.data;
		renderUI(todos, listStatus);
	} catch (error) {
		console.log(error);
	}
}

//Add Todos

async function postTodos(title) {
	try {
		const res = await postTodosAPI(title);
		todo_inputEl.value = "";
		getTodos();
	} catch (error) {
		console.log(error);
	}
}

todo_btnAddEl.addEventListener(`click`, function () {
	const todoTitle = todo_inputEl.value;
	if (todoTitle === "") {
		alert("Tiêu đề không được để trống");
		return;
	}
	postTodos(todoTitle);
});

// Delete todo

async function deleteTodos(id) {
	if (disableRadio === true) {
		alert("Hãy hoàn thiện việc sửa trước khi có thao tác khác!");
		return;
	}
	try {
		const res = await deleteTodosAPI(id);
		if (res.status === 200) getTodos();
	} catch (error) {
		console.log(error);
	}
}

async function changeStatusTodos(id) {
	try {
		const status = todos.find((todo) => todo.id === id).status;
		const res = await patchStatusTodosAPI(id, !status);
		getTodos();
	} catch (error) {
		console.log(error);
	}
}

// Edit title todo

async function changeTitleTodos(id, title) {
	try {
		const res = await patchTitleTodosAPI(id, title);
		getTodos();
	} catch (error) {
		console.log(error);
	}
}

function editTodos(id) {
	disableRadio = true;
	toggleRadio();
	const editTodo = todos.find((todo) => todo.id === id);
	todo_editInputEl.value = editTodo.title;
	todo_editIndexEl.value = editTodo.id;
	todo_editDivEl.classList.remove("hidden");
	todo_addDivEl.classList.add("hidden");
}

todo_btnEditEl.addEventListener(`click`, function () {
	disableRadio = false;
	toggleRadio();
	const editTitle = todo_editInputEl.value;
	const editID = todo_editIndexEl.value;
	changeTitleTodos(editID, editTitle);
	todo_editDivEl.classList.add("hidden");
	todo_addDivEl.classList.remove("hidden");
});

radio_active.addEventListener(`change`, function () {
	listStatus = `active`;
	renderUI(todos, listStatus);
});

radio_all.addEventListener(`change`, function () {
	listStatus = `all`;
	renderUI(todos, listStatus);
});

radio_unactive.addEventListener(`change`, function () {
	listStatus = `unactive`;
	renderUI(todos, listStatus);
});

// Render UI - hiển thị danh sách Todo ra ngoài giao diện

function renderUI(arr, listStatus) {
	todo_listEl.innerHTML = "";
	switch (listStatus) {
		case `unactive`:
			list = arr.filter((todo) => todo.status === false);
			break;
		case `active`:
			list = arr.filter((todo) => todo.status === true);
			break;
		case `all`:
			list = arr;
			break;
	}
	if (list.length === 0) {
		todo_listEl.innerHTML = "Không có công việc nào trong danh sách";
		return;
	} else {
		for (const work of list) {
			todo_listEl.innerHTML += `
                <div class="todo-item ${work.status ? `active-todo` : ``}">
                    <div class="todo-item-title">
                        <input type="checkbox" ${work.status ? `checked` : ``} onclick="changeStatusTodos(${
				work.id
			})" />
                        <p>${work.title}</p>
                     </div>
                     <div class="option">
                         <button class="btn btn-update" onclick="editTodos(${work.id})">
                            <img src="./img/pencil.svg" alt="icon" />
                         </button>
                         <button class="btn btn-delete" onclick="deleteTodos(${work.id})">
                            <img src="./img/remove.svg" alt="icon" />
                          </button>
                     </div>
                </div>
            `;
		}
	}
}

function toggleRadio() {
	// disableRadio = !disableRadio;
	radio_active.disabled = disableRadio;
	radio_unactive.disabled = disableRadio;
	radio_all.disabled = disableRadio;
	todo_listEl.querySelectorAll("input").forEach((element) => {
		element.disabled = disableRadio;
	});
}

// Main

window.onload = function () {
	getTodos();
};
