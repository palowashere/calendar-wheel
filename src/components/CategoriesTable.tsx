import React from "react";
import { Category } from "../types";

interface CategoriesTableProps {
  categories: readonly Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export function CategoriesTable({ categories, setCategories }: CategoriesTableProps) {
  const handleDelete = (id: string) => {
    setCategories((categories) => categories.filter((cat) => cat.id !== id));
  };

  const handleChangeName = (id: string, name: string) => {
    setCategories((categories) =>
      categories.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const handleChangeColor = (id: string, color: string) => {
    setCategories((categories) =>
      categories.map((cat) => (cat.id === id ? { ...cat, color } : cat))
    );
  };

  const handleChangeFontColor = (id: string, fontColor: string) => {
    setCategories((categories) =>
      categories.map((cat) => (cat.id === id ? { ...cat, fontColor } : cat))
    );
  };

  const handleNew = () => {
    const newId = Math.random().toString(36).slice(2);
    setCategories((categories) => [
      ...categories,
      { id: newId, name: "", color: "#ffffff", fontColor: "#000000" },
    ]);
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Categories</h3>
      <table className="table-auto w-full border-collapse text-sm leading-tight [&_td]:border border-gray-400">
        <thead>
          <tr>
            <th className="w-32">Name</th>
            <th className="w-32">Background Color</th>
            <th className="w-32">Font Color</th>
            <th>
              <button
                onClick={handleNew}
                className="border border-gray-400 px-1 py-0.5"
              >
                New Category
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <input
                  value={category.name}
                  onChange={(e) => handleChangeName(category.id, e.target.value)}
                  className="w-full"
                />
              </td>
              <td>
                <input
                  type="color"
                  value={category.color}
                  onChange={(e) => handleChangeColor(category.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  type="color"
                  value={category.fontColor}
                  onChange={(e) => handleChangeFontColor(category.id, e.target.value)}
                />
              </td>
              <td>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="border border-gray-400 px-1 py-0.5"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}