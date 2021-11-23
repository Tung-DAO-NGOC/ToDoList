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
let disable_radio = false;

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
		renderUI(todos);
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

async function deleteTodos(id) {
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

async function changeTitleTodos(id, title) {
	try {
		const res = await patchTitleTodosAPI(id, title);
		getTodos();
	} catch (error) {
		console.log(error);
	}
}

function editTodos(id) {
	toggleRadio();
	const editTodo = todos.find((todo) => todo.id === id);
	todo_editDivEl.classList.remove("hidden");
	todo_addDivEl.classList.add("hidden");
	todo_editInputEl.value = editTodo.title;
	todo_editIndexEl.value = editTodo.id;
}

todo_btnEditEl.addEventListener(`click`, function () {
	const editTitle = todo_editInputEl.value;
	const editID = todo_editIndexEl.value;
	changeTitleTodos(editID, editTitle);
	todo_editDivEl.classList.add("hidden");
	todo_addDivEl.classList.remove("hidden");
	toggleRadio();
});

// Render UI - hiển thị danh sách Todo ra ngoài giao diện

function renderUI(arr) {
	todo_listEl.innerHTML = "";
	if (arr.length === 0) {
		todo_listEl.innerHTML = "Không có công việc nào trong danh sách";
		return;
	} else {
		for (const work of arr) {
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
	disable_radio = !disable_radio;
	radio_active.disabled = disable_radio;
	radio_unactive.disabled = disable_radio;
	radio_all.disabled = disable_radio;
}

// Main

window.onload = function () {
	getTodos();
};
