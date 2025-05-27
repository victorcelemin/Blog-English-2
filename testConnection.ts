import { query } from "./lib/db";

(async () => {
  try {
    const result = await query("SELECT NOW()");
    console.log("Conexión exitosa:", result);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
})();