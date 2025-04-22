const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, initializeDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || '*',
  }),
);
app.use(express.json());

// Inicializar la base de datos
initializeDatabase().catch(console.error);

// Función para convertir un registro de la base de datos a un objeto post
function dbPostToApiPost(post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    readTime: post.read_time,
    category: post.category,
    author: {
      name: post.author_name,
      avatar: post.author_avatar,
    },
    studentName: post.student_name,
    source: post.source,
    content: post.content,
  };
}

// Rutas API
// GET /api/posts - Obtener todos los posts
app.get('/api/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    const posts = rows.map(dbPostToApiPost);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:slug - Obtener un post por slug
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await pool.query('SELECT * FROM posts WHERE slug = $1', [slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const post = dbPostToApiPost(rows[0]);
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Crear un nuevo post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, excerpt, content, author, studentName, source, category } = req.body;
    
    // Generar slug a partir del título
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Generar fecha y tiempo de lectura
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const readTime = `${Math.max(1, Math.ceil(content.length / 1000))} min read`;
    
    // Insertar el nuevo post en la base de datos
    const { rows } = await pool.query(`
      INSERT INTO posts (
        slug, title, excerpt, date, read_time, category, 
        author_name, author_avatar, student_name, source, content
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      slug, title, excerpt, date, readTime, category,
      author.name, author.avatar, studentName, source, content
    ]);
    
    const newPost = dbPostToApiPost(rows[0]);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// DELETE /api/posts/:id - Eliminar un post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }
    
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Ruta de estado para verificar que el servidor esté funcionando
app.get('/api/health', async (req, res) => {
  try {
    // Verificar la conexión a la base de datos
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      time: rows[0].now
    });
  } catch (error) {
    console.error('Error checking health:', error);
    res.status(500).json({ 
      status: 'error', 
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Para servicios como Vercel que utilizan serverless functions
module.exports = app;
