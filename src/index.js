import express from "express";
import {uploader} from "./util.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = [
  {
    id: 1,
    username: "dannagarcia",
    email: "danna.garcia@udla.edu.co",
    rol: "student",
  },
  { id: 2, username: "juan", email: "juan@udla.edu.co", rol: "student" },
  { id: 3, username: "martin", email: "martin@udla.edu.co", rol: "student" },
];

const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", express.static(`public`));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,`../public/index.html`));
});

app.get("/api", (req, res) => {
  res.send("Hola mundo");
});
app.get("/api/users", (req, res) => {
  res.send(data);
});
// app.get("/api/users/:id/:username", (req, res) => {
//   const {id, username} = req.params;
//   const user = data.find((u) => u.id === parseInt(id) && u.username === username);
//   if (!user) {
//     return res.status(404).json({ error: "user not found" });
//   }
//   res.json(user);
// });

// app.get('/api/users/consulta', (req, res) => {
//   const {id, username} = req.query;  
//   const user = data.find(u => u.id === parseInt(id) && u.username === username);
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }
//   res.json(user);
// });

// app.get("/api/users/:username", (req, res) => {
//   const username = req.params.username;
//   const user = data.find((u) => u.username === username);
//   if (!user) {
//     return res.status(404).json({ error: "user not found" });
//   }
//   res.json(user);
// });

app.get('/api/users/:id', (req, res) => {
  const {id} = req.params;
  const user = data.find(u => u.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.post("/api/users", (req, res) => {
  const { id, username, email, rol } = req.body;
  if ((!id, !username, !email, !rol)) {
    return res.status(404).json({ error: "user not found" });
  }
  const newUser = { id, username, email, rol };
  data.push(newUser);
  res.status(201).json(newUser);
});

app.post('/api/userFIle', uploader.single('avatar'), (req, res)=>{
  const file = req.file;
  console.log(file);
  if(!file){
    return res.status(400).json({ error: `No se ha subio ningún archivo`});
  }
  const {id, username, email, rol} = req.body;
   if(!id || !username || !email || !rol) {
    return res.status(400).json({ error: 'Faltan campos para crear un usuario' });
  }
  const newUser = {id, username, email, rol, file};
  data.push(newUser);
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
