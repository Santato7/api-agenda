import express from "express";
import "dotenv/config";
const mysql = require("mysql2/promise");
const cors = require("cors");

var app = express();
app.use(cors());

if (!module.parent) {
  app.listen(3000);
  console.log("Express started on port 3000");
}

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

app.get("/compromisso", async function (req: any, res: any) {
  const idCompromisso: number = req.query.id;

  let compromissos: string = "[]";

  if (idCompromisso != null) {
    compromissos = await getCompromissoById(idCompromisso);
  } else {
    compromissos = await getAllCompromissos();
  }

  res.json(compromissos);
});

const getAllCompromissos = async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `COMPROMISSO` ORDER BY `DATA_COMPROMISSO`, `HORA_COMPROMISSO`"
    );
    return rows;
  } finally {
    connection.end();
  }
};

const getCompromissoById = async (_idCompromisso: number) => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM `COMPROMISSO` WHERE `ID_COMPROMISSO` = ?",
      [_idCompromisso]
    );
    return rows;
  } finally {
    connection.end();
  }
};

export default app;
