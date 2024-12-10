import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import ModalComponent from "./components/ModalComponent";

function App() {
  const [users, setUsers] = useState([
    { id: 1, name: "Junnu", email: "junnu@example.com", phone: "1234567890" },
    { id: 2, name: "Priayansh", email: "priayansh@example.com", phone: "0987654321" },
  ]);
  const [formData, setFormData] = useState({ id: null, name: "", email: "", phone: "" });
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || users;
    setUsers(storedUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const { name, email, phone } = formData;

    if (!name || !email || !phone) {
      toast.error("All fields are required!");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email!");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      toast.error("Please enter a valid phone number!");
      return;
    }

    if (modalType === "add") {
      const newUser = { ...formData, id: Date.now() };
      setUsers([...users, newUser]);
      toast.success("User added successfully!");
    } else if (modalType === "edit") {
      setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
      toast.success("User updated successfully!");
    }

    setShowModal(false);
    setFormData({ id: null, name: "", email: "", phone: "" });
  };

  const handleEdit = (user) => {
    setFormData(user);
    setModalType("edit");
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    toast.success("User deleted successfully!");
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openAddModal = () => {
    setModalType("add");
    setFormData({ id: null, name: "", email: "", phone: "" });
    setShowModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4">User Management</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mb-3 me-3" onClick={openAddModal}>
        Add User
      </button>
      <CSVLink data={users} filename={"users.csv"} className="btn btn-info mb-3">
        Export to CSV
      </CSVLink>
      <UserList users={filteredUsers} onEdit={handleEdit} onDelete={openDeleteModal} />

      {showModal && (
        <ModalComponent
          title={modalType === "add" ? "Add User" : "Edit User"}
          show={showModal}
          handleClose={() => setShowModal(false)}
          footerButtons={[
            {
              label: "Save",
              className: "btn-primary",
              onClick: handleSave,
            },
            {
              label: "Cancel",
              className: "btn-secondary",
              onClick: () => setShowModal(false),
            },
          ]}
        >
          {modalType === "add" ? (
            <AddUser formData={formData} handleChange={handleChange} />
          ) : (
            <EditUser formData={formData} handleChange={handleChange} />
          )}
        </ModalComponent>
      )}

      {showDeleteModal && (
        <ModalComponent
          title="Confirm Deletion"
          show={showDeleteModal}
          handleClose={cancelDelete}
          footerButtons={[
            {
              label: "Delete",
              className: "btn-danger",
              onClick: confirmDelete,
            },
            {
              label: "Cancel",
              className: "btn-secondary",
              onClick: cancelDelete,
            },
          ]}
        >
          <p>
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
          </p>
        </ModalComponent>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
