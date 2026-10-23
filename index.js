const express = require ("express")
const app = express()
const mysql = require("mysql2/promise")
app.use(express.json())

const pool = mysql.createPool({
    host:"localhost",
    port: 3307,
    user:"root",
    password: "root",
    database: "usuarios_api",
    waitForConnections: true,
})

app.get("/usuarios", async (req, res) => {
    const [usuarios] = await pool.execute("SELECT * FROM usuario")
    return res.json(usuarios)
})

app.post("/usuarios", async (req, res) => {
    const {email, senha} = req.body

    if(!email || !senha ){
        return res.status(404).json({error: "email e senha precisam ser colocados"})
    }
    
    const [usuario] = await pool.execute(
        "INSERT INTO usuario (email, senha) VALUES (?, ?)",
        [email, senha]
    )
    return res.status(201).json({id: usuario.insertId, email, senha})
})
app.put("/usuarios/:id", async (req, res) => {
    const {email, senha} = req.body
    const id = req.params.id

    if(!email || !senha) {
        return res.status(400).json({error: "email e senha são obrigatorios"})


    }

    await pool.execute(
        "UPDATE usuario SET email = ?, senha = ? WHERE id = ?",
        [email, senha, id]
    )
   
    return res.status(200).json({email, senha, id})
})
app.delete("/usuarios/:id", async (req, res) => {
    const {id} = req.params
    await pool.execute("DELETE FROM usuario WHERE id = ?", [id])
    return res.status(204).send()
})

app.listen(3000, () => console.log("API no ar :D"))