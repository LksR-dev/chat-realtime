import { rtdb } from "./rtdb";
import { map } from "lodash";

const API_BASE_URL = "http://localhost:3000";

type Messages = {
  from: string;
  message: string;
};

//TODO: CAMBIAR LOS FETCH PARA QUE LA DATA SE MANEJE DESDE AQUÍ
const state = {
  data: {
    name: null,
    email: null,
    userId: null,
    roomId: null,
    rtdbRoomId: null,
    messages: [],
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setEmailAndName(email, name) {
    const cs = this.getState();
    cs.email = email;
    cs.name = name;
    this.setState(cs);
  },

  setUserId(userId) {
    const cs = this.getState();
    cs.userId = userId;
    this.setState(cs);
  },

  setRoomId(roomId) {
    const cs = this.getState();
    cs.roomId = roomId;
    this.setState(cs);
  },

  setLongRoomId(longId) {
    const cs = this.getState();
    cs.rtdbRoomId = longId;
    this.setState(cs);
  },

  listenRoom(idRoom) {
    const chatRoomRef = rtdb.ref(`/rooms/${idRoom}`);
    chatRoomRef.on("value", snapshot => {
      const cs = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);
      cs.messages = messagesList;
      this.setState(cs);
    });
  },

  // CREATEUSER NOS DEVUELVE EL ID DEL USUARIO
  createUser() {
    const cs = this.getState();
    if (cs.email) {
      fetch(`${API_BASE_URL}/signup`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cs.name, email: cs.email }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.userId = res.id;
          this.setState(cs);
        });
    } else {
      alert("Debes colocar un mail.");
    }
  },
  // AUTENTICA EL EMAIL Y RETORNA EL ID DEL USUARIO
  getAuth(email) {
    return fetch(`${API_BASE_URL}/auth`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        return res;
      });
  },

  createRoom() {
    const cs = this.getState();
    if (cs.userId) {
      fetch(`${API_BASE_URL}/rooms`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.roomId = res.id;
          this.setState(cs);
        });
    }
  },
  connectToRoom(roomId, userId) {
    return fetch(`${API_BASE_URL}/rooms/${roomId}?userId=${userId}`)
      .then(data => {
        return data.json();
      })
      .then(res => {
        return res;
      });
  },

  pushMessages(message: string) {
    const cs = this.getState();
    fetch(`${API_BASE_URL}/messages`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: cs.name,
        message: message,
      }),
    });
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    console.log("Soy el state, he cambiado", this.data);
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
