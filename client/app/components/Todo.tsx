import React, { useState } from "react";
import { TodoType } from "../types";
import useSWR from "swr";
import { useTodos } from "../hooks/useTodos";
import { API_URL } from "@/constants/url";

type Props = {
  todo: TodoType;
};

export const Todo = ({ todo }: Props) => {
  const { id, title, isCompleted } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const { todos, isLoading, error, mutate } = useTodos();
  // 編集ボタンの実装
  const handleEdit = async () => {
    setIsEditing(!isEditing);

    if (isEditing) {
      const res = await fetch(`${API_URL}/edit-todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          isCompleted: false,
        }),
      });

      if (res.ok) {
        const editedTodo: TodoType = await res.json();
        const updatedTodos = todos.map((todo: TodoType) => (todo.id === editedTodo.id ? editedTodo : todo));
        mutate(updatedTodos);
      }
    }
  };

  // 削除ボタンの実装
  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_URL}/delete-todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const updatedTodos = todos.filter((todo: TodoType) => todo.id !== id);
      mutate(updatedTodos);
    }
  };

  // 完了未完了の実装
  const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
    const res = await fetch(`${API_URL}/edit-todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isCompleted: !isCompleted,
      }),
    });

    if (res.ok) {
      const editedTodo: TodoType = await res.json();
      const updatedTodos = todos.map((todo: TodoType) => (todo.id === editedTodo.id ? editedTodo : todo));
      mutate(updatedTodos);
    }
  };
  return (
    <li className='py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='todo1'
            name='todo1'
            type='checkbox'
            className='h-4 w-4 text-teal-600 focus:ring-teal-500
            border-gray-300 rounded'
            onChange={() => toggleTodoCompletion(id, isCompleted)}
          />
          <label className='ml-3 block text-gray-900'>
            {isEditing ? (
              <input
                type='text'
                className='border rounded py-1 px-2'
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              <span className={`text-lg font-medium mr-2 ${isCompleted && "line-through"}`}>{title}</span>
            )}
          </label>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            className='duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded'
            onClick={handleEdit}
          >
            {isEditing ? "Save" : "✒"}
          </button>
          <button
            className='bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded'
            onClick={() => handleDelete(id)}
          >
            ✖
          </button>
        </div>
      </div>
    </li>
  );
};
