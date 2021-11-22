/*
1. Lấy danh sách hiện có
2. Thêm cv
3. Sửa cv
4. Xóa cv
5. Lọc cv theo trạng thái
6. Thay đổi trạng thái 
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

// API
// Lấy danh sách todo

function getTodosAPI() {
	return axios.get("/todos"); // => Luôn trả về promise
}

function postTodosAPI(titleTodo) {
	return axios.post("/todos", {
		id: createID(),
		title: titleTodo,
		status: false,
	});
}

function deleteTodosAPI(id) {
	return axios({
		method: `delete`,
		url: `/todos/${id}`,
	});
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
                        <input type="checkbox" ${work.status ? `checked` : ``}/>
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

// Hàm xử lý
// Lấy danh sách to do
async function getTodos() {
	try {
		const res = await getTodosAPI();
		todos = res.data;
		renderUI(todos);
	} catch (error) {
		console.log(error);
	}
}

async function postTodos(title) {
	try {
		const res = await postTodosAPI(title);
		getTodos();
	} catch (error) {
		console.log(error);
	}
}

async function deleteTodos(id) {
	try {
		const res = await deleteTodosAPI(id);
		if (res.status === 200) getTodos();
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

// Main

window.onload = function () {
	getTodos();
};
