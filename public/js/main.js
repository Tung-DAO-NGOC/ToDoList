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
const todo_btnAddEl = document.querySelector("#btn-add");
// Khai báo biến
let todos = [];

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
	console.log(statusInput);
	return axios.patch(`/todos/${id}`, {
		status: statusInput,
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
	let todoTitle = todo_inputEl.value;
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

async function changeStatusTodos(id, status) {
	try {
		const res = await patchStatusTodosAPI(id, !status ? true : false);
		getTodos();
	} catch (error) {
		console.log(error);
	}
}

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
                        <input type="checkbox" ${work.status ? `checked` : ``} onclick="changeStatusTodos(${work.id}, ${
				work.status
			})" />
                        <p>${work.title}</p>
                     </div>
                     <div class="option">
                         <button class="btn btn-update">
                            <img src="./img/pencil.svg" alt="icon" />
                         </button>
                         <button class="btn btn-delete" onclick=deleteTodos(${work.id})>
                            <img src="./img/remove.svg" alt="icon" />
                          </button>
                     </div>
                </div>
            `;
		}
	}
}

// Main

window.onload = function () {
	getTodos();
};
