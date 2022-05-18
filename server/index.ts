import express from "express";
import cors from "cors";
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";

// INIT APP AND CFG
const app = express();
app.use(express.json());
app.use(cors());

const userColl = firestore.collection("users");
const roomsColl = firestore.collection("rooms");

// CREAMOS EL USUARIO DEVOLVIENDO SU IDDOC
app.post("/signup", (req, res) => {
  const { name } = req.body;
  const { email } = req.body;

  userColl
    .where("email", "==", email)
    .get()
    .then(snap => {
      if (snap.empty) {
        userColl
          .add({
            name: name,
            email: email,
          })
          .then(newUserDoc => {
            res.status(201).json({
              id: newUserDoc.id,
              new: true,
            });
          });
      } else {
        res.status(200).json({
          id: snap.docs[0].id,
          message: "Email existente",
        });
      }
    });
});

// AUTH
app.post("/auth/users", (req, res) => {
  const { email } = req.body;

  userColl
    .where("email", "==", email)
    .get()
    .then(resQ => {
      if (resQ.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.status(200).json({
          id: resQ.docs[0].id,
        });
      }
    });
});
app.post("/auth/rooms", (req, res) => {
  const { id } = req.body;

  roomsColl
    .doc(id.toString())
    .get()
    .then(doc => {
      if (doc.exists) {
        res.status(200).json({
          id: doc.id,
          message: "Sala encontrada.",
        });
      } else {
        res.status(400).json({
          message: `La sala ${id} no existe, por favor, ingrese un ID válido.`,
        });
      }
    });
});

// CREATE ROOM
// SETEAMOS COMO PROPIETARIO DE LA SALA EN LA RTDB: EL ID DEL USUARIO
// Y EN LA ROOMSCOLL DE FIRESTORE: CREAMOS UN ID CORTO PARA EL DOCUMENTO
// Y DENTRO DE ESE DOCUMENTO GUARDAMOS: EL ID LARGO DE LA RTDB
// ESTO NOS VA A SERVIR PARA QUE LUEGO DESDE FIRESTORE AL OBTENER EL RTDBID QUE HAY DENTRO DE n SALA
// CON ESE RTDBID OBTENDREMOS EL PROPIETARIO DE LA SALA EN LA RTDB, ES DECIR, EL USERID DE LA USERSCOLL EN FIRESTORE
app.post("/rooms", (req, res) => {
  const { userId } = req.body;

  userColl
    .doc(userId.toString())
    .get()
    .then(doc => {
      if (doc.exists) {
        const roomRef = rtdb.ref("/rooms/" + nanoid());

        roomRef
          .set({
            messages: [{ from: "", message: "" }],
            owner: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomsColl
              .doc(roomId.toString())
              .set({ rtdbId: roomLongId })
              .then(() => {
                res.status(200).json({
                  id: roomId,
                });
              });
          });
      } else {
        res.status(401).json({
          message: "El usuario no existe.",
        });
      }
    });
});
app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.query;

  userColl
    .doc(userId.toString())
    .get()
    .then(doc => {
      if (doc.exists) {
        roomsColl
          .doc(roomId)
          .get()
          .then(snap => {
            const data = snap.data();
            res.status(200).json(data);
          });
      } else {
        res.status(401).json({
          message: "El usuario no existe.",
        });
      }
    });
});
app.post("/rooms/:id", (req, res) => {
  const chatRoomRef = rtdb.ref(`/rooms/${req.params.id}/messages`);
  chatRoomRef.push(req.body, () => {
    res.json(req.body);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
