import { useEffect, useState } from "react";
import type { User, UsersResponse } from "./types/user";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://dummyjson.com/users");
        if (!response.ok) {
          throw new Error("Не удалось найти пользователей");
        }
        const data: UsersResponse = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ошибка при загрузке пользователей",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Ошибка: {error}</div>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Users Dashboard</h1>
        <input
          type="text"
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
      </header>
      <main className="users-grid">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="user-card">
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <p>Возраст: {user.age}</p>
            <p>Пол: {user.gender}</p>
            <p>
              Email: <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
            <p>
              Телефон: <a href={`tel:${user.phone}`}>{user.phone}</a>
            </p>
            <p>
              Дата рождения: {new Date(user.birthDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </main>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Предыдущая
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
