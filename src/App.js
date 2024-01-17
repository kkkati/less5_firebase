import { useState, useEffect } from "react";
import styles from "./app.module.css";
import { ref, onValue, push, update, remove } from "firebase/database";
import { db } from "./firebase";

const App = () => {
  const [todos, setTodos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("Новая задача");
  const [findTodo, setFindTodo] = useState("Введите фрагмент задачи");
  const [idFoundTodo, setIdFoundTodo] = useState("");
  const [isNewTodo, setIsNewTodo] = useState(false);
  const [idUpdateTodo, setIdUpdateTodo] = useState("Введите id задачи");
  const [idDeleteTodo, setIdDeleteTodo] = useState("Введите id задачи");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeliting] = useState(false);
  const [isFind, setIsFind] = useState(false);
  const [isSort, setIsSort] = useState(false);

  const todosArray = Object.entries(todos);

  const todosSort = isSort
    ? todosArray.sort((a, b) => {
        return a[0].title > b[0].title ? 1 : -1;
      })
    : todosArray;

  useEffect(() => {
    const todosDbRef = ref(db, "todos");

    return onValue(todosDbRef, (snapShot) => {
      const loadedTodos = snapShot.val() || {};
      setTodos(loadedTodos);
      setIsLoading(false);
    });
  }, []);

  const onSubmitAddTodo = (event) => {
    event.preventDefault();
    setIsCreating(true);

    const todosDbRef = ref(db, "todos");

    push(todosDbRef, { title: newTodo })
      .then((response) => {
        console.log("Добавлена задача:", response);
      })
      .finally(() => {
        console.log("Добавлена задача:");
        setNewTodo("Новая задача");
        setIsNewTodo(!isNewTodo);
        setIsCreating(false);
      });
  };

  const onSubmitUpdateTodo = (event) => {
    event.preventDefault();
    setIsUpdating(true);
    const todoDbRef = ref(db, `todos/${idUpdateTodo}`);
    update(todoDbRef, { completed: "Выполнено: " })
      .then((response) => {
        console.log("Задача обновлена:", response);
      })
      .finally(() => {
        setIsNewTodo(!isNewTodo);
        setIdUpdateTodo("Введите id задачи");
        setIsUpdating(false);
      });
  };

  const onSubmitDeleteTodo = (event) => {
    event.preventDefault();
    setIsDeliting(true);

    const todoDbRef = ref(db, `todos/${idDeleteTodo}`);
    remove(todoDbRef)
      .then((response) => {
        console.log("Задача удалена:", response);
      })
      .finally(() => {
        setIsNewTodo(!isNewTodo);
        setIdDeleteTodo("Введите id задачи");
        setIsUpdating(false);
      });
  };

  const onClickSortTodos = () => {
    setIsSort(!isSort);
    console.log(todosSort);
  };

  const onSubmitFindTodo = (event) => {
    event.preventDefault();
    setIsFind(true);

    todosArray.forEach((el) => {
      if (el[1].title.toLowerCase().includes(findTodo)) {
        setIdFoundTodo(el[0]);
      }
    });

    setIsFind(false);
    setFindTodo("Введите фрагмент задачи");
  };

  //обработчики
  const onChangeNewTodo = ({ target }) => {
    setNewTodo(target.value);
  };

  const onChangeIdUpdateTodo = ({ target }) => {
    setIdUpdateTodo(target.value);
  };

  const onChangeIdDeleteTodo = ({ target }) => {
    setIdDeleteTodo(target.value);
  };

  const onChangeFindTodo = ({ target }) => {
    setFindTodo(target.value);
  };

  return (
    <div className={styles.app}>
      <div className={styles.tools}>
        <form onSubmit={onSubmitAddTodo}>
          <input
            className={styles.input}
            type="text"
            name="newTodo"
            value={newTodo}
            onChange={onChangeNewTodo}
          ></input>
          <button className={styles.button} disabled={isCreating} type="submit">
            Добавить задачу
          </button>
        </form>
        <form onSubmit={onSubmitUpdateTodo}>
          <input
            className={styles.input}
            type="text"
            name="idUpdateTodo"
            value={idUpdateTodo}
            onChange={onChangeIdUpdateTodo}
          ></input>
          <button className={styles.button} disabled={isUpdating} type="submit">
            Задача выполнена
          </button>
        </form>
        <form onSubmit={onSubmitDeleteTodo}>
          <input
            className={styles.input}
            type="text"
            name="idDeleteTodo"
            value={idDeleteTodo}
            onChange={onChangeIdDeleteTodo}
          ></input>
          <button className={styles.button} disabled={isDeleting} type="submit">
            Удалить задачу
          </button>
        </form>
        <form onSubmit={onSubmitFindTodo}>
          <input
            className={styles.input}
            type="text"
            name="findTodo"
            value={findTodo}
            onChange={onChangeFindTodo}
          ></input>
          <input
            className={styles.input}
            type="text"
            name="foundTodo"
            value={"Id задачи:" + idFoundTodo}
          ></input>
          <button className={styles.button} disabled={isFind} type="submit">
            Найти задачу
          </button>
        </form>
        <button className={styles.button} onClick={onClickSortTodos}>
          Сортировать
        </button>
      </div>

      <div className={styles.todosContainer}>
        {isLoading ? (
          <div className={styles.loader}></div>
        ) : (
          todosSort.map(([id, { title, completed }]) => (
            <li className={styles.todos} key={id}>
              {completed}
              {title}. Id:
              {id}
            </li>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
