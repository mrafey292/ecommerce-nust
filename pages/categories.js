import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import { set } from "mongoose";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    if (!name.trim()) {
      swal.fire({
        title: "Error",
        text: "Category name is required.",
        icon: "error",
      });
      return;
    }

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Categories
      </h1>
      <label
        style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}
      >
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create New Category"}
      </label>

      <form
        onSubmit={saveCategory}
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <div className="flex gap-1" style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Category Name"
            onChange={(ev) => setName(ev.target.value)}
            value={name}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label
            className="block"
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            Properties
          </label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "5px 10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2" style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="Property Name"
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <input
                  type="text"
                  value={property.values}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  placeholder="Values, comma separated"
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="btn-default"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary py-1"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table
          className="basic mt-4"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                Category Name
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                Parent Category
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {category.name}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    {category?.parent?.name}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-primary mr-1"
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-primary"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
