import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const query = async (sql: string, params?: any[]) => {
  const result = await pool.query(sql, params);
  return result.rows;
};

// Obtener todas las publicaciones
export const getAllPosts = async () => {
  const result: any = await query("SELECT * FROM posts ORDER BY created_at DESC");
  return result;
};

// Obtener una publicación por slug
export const getPostBySlug = async (slug: string) => {
  const result: any = await query("SELECT * FROM posts WHERE slug = $1", [slug]);
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
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
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
  return result[0];
};

// Eliminar una publicación por ID
export const deletePost = async (id: number) => {
  const result: any = await query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);
  return result.length > 0;
};
