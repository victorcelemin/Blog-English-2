"use client";

import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const query = async (sql: string, params?: any[]) => {
  const [results]: any = await pool.execute(sql, params);
  return results;
};

// Obtener todas las publicaciones
export const getAllPosts = async () => {
  const result: any = await query("SELECT * FROM posts ORDER BY created_at DESC");
  return result;
};

// Obtener una publicación por slug
export const getPostBySlug = async (slug: string) => {
  const result: any = await query("SELECT * FROM posts WHERE slug = ?", [slug]);
  return result[0];
};

// Agregar una nueva publicación
export const addPost = async (post: {
  title: string;
  author_name: string;
  student_number: string;
  source: string | null;
  category: string;
  description: string;
  content: string;
}) => {
  const result: any = await query(
    `INSERT INTO posts (title, author_name, student_number, source, category, description, content)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      post.title,
      post.author_name,
      post.student_number,
      post.source,
      post.category,
      post.description,
      post.content,
    ]
  );
  return result;
};

// Eliminar una publicación por ID
export const deletePost = async (id: number) => {
  const result: any = await query("DELETE FROM posts WHERE id = ? ", [id]);
  return result.affectedRows > 0;
};
