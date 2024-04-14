// Ladataan riippuvuudet
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Alustetaan sovellus ja Prisma
const prisma = new PrismaClient();
const app = express();

// Käytetään JSON-muotoa
app.use(express.json());

// cors
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
// });

// Testataan API:n toimivuuutta virheenkäsittelyllä
app.get("/test", async (req, res, next) => {
  try {
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    next(error);
  }
});

// Haetaan kaikki käyttäjät tietokannasta
app.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// Haetaan käyttäjä id:n perusteella
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Luodaan uusi käyttäjä
app.post("/users", async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: { ...req.body },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Päivitetään käyttäjän tiedot
app.put("/users/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { ...req.body },
    });
  } catch (error) {
    next(error);
  }
});

// Poistetaan käyttäjä
app.delete("/users/:id", async (req, res, next) => {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
  } catch (error) {
    next(error);
  }
});

// Käynnistetään palvelin
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
