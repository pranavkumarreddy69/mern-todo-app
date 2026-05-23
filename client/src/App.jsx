import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);




  // CHECK LOGIN
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {

      setIsLoggedIn(true);

      getTodos();

    }

  }, []);




  // REGISTER
  const registerUser = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/register",
        {
          email,
          password
        }
      );

      alert(response.data.message);

    } catch (error) {

      alert("Registration Failed");

    }

  };




  // LOGIN
  const loginUser = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setIsLoggedIn(true);

      alert(response.data.message);

      getTodos();

    } catch (error) {

      alert("Login Failed");

    }

  };




  // LOGOUT
  const logoutUser = () => {

    localStorage.removeItem("token");

    setIsLoggedIn(false);

    setTodos([]);

  };




  // GET TODOS
  const getTodos = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/todos",
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }
      );

      setTodos(response.data);

    } catch (error) {

      console.log(error);

    }

  };




  // ADD TODO
  const addTodo = async () => {

    if (!text) return;

    await axios.post(
      "http://localhost:5000/add",
      {
        text: text
      }
    );

    setText("");

    getTodos();

  };




  // DELETE TODO
  const deleteTodo = async (id) => {

    await axios.delete(
      `http://localhost:5000/delete/${id}`
    );

    getTodos();

  };




  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800">

        <h1 className="text-4xl font-bold mb-8 text-center">
          MERN Todo App
        </h1>




        {!isLoggedIn ? (

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none"
            />



            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none"
            />



            <div className="flex gap-4">

              <button
                onClick={registerUser}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all p-4 rounded-xl font-semibold"
              >
                Register
              </button>



              <button
                onClick={loginUser}
                className="flex-1 bg-green-600 hover:bg-green-700 transition-all p-4 rounded-xl font-semibold"
              >
                Login
              </button>

            </div>

          </div>

        ) : (

          <div>

            <div className="flex justify-end mb-6">

              <button
                onClick={logoutUser}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl"
              >
                Logout
              </button>

            </div>



            <div className="flex gap-3">

              <input
                type="text"
                placeholder="Enter Todo"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 p-4 rounded-xl bg-zinc-800 border border-zinc-700 outline-none"
              />



              <button
                onClick={addTodo}
                className="bg-purple-600 hover:bg-purple-700 transition-all px-6 rounded-xl font-semibold"
              >
                Add
              </button>

            </div>



            <div className="mt-8 space-y-4">

              {todos.map((todo) => (

                <div
                  key={todo._id}
                  className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl flex items-center justify-between"
                >

                  <p className="text-lg">
                    {todo.text}
                  </p>



                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="bg-red-600 hover:bg-red-700 transition-all px-4 py-2 rounded-xl"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>

  );

}

export default App;