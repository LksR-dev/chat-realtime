import { rtdb } from "./rtdb";

const API_BASE_URL = "http://localhost:3000";

type Messages = {
  from: string;
  message: string;
};

const state = {
  data: {
    nombre: null,
    email: null,
    roomId: null,
    rtdbRoomId: null,
    messages: [],
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setName(name) {
    const cs = this.getState();
    cs.nombre = name;
    this.setState(cs);
  },

  setEmail(email) {
    const cs = this.getState();
    cs.email = email;
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
  },

  // CREATEUSER NOS DEVUELVE EL ID DEL USUARIO
  createUser(name, email) {
    return fetch(`${API_BASE_URL}/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        return res;
      });
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

  createRoom(userId) {
    return fetch(`${API_BASE_URL}/rooms`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        return res;
      });
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
