import { rtdb } from "./rtdb";
import { map } from "lodash";

const API_BASE_URL = "https://chatapp-realtime-dwfm6.herokuapp.com";

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
    if (roomId !== undefined) {
      cs.roomId = roomId;
      this.setState(cs);
    }
  },

  setLongRoomId(longId) {
    const cs = this.getState();
    cs.rtdbRoomId = longId;
    this.setState(cs);
  },
  // OBTENEMOS EL ID DEL USUARIO EN FIRESTORE,
  // PARA LUEGO CON ESE ID CREAR UNA ROOM EN LA RTDB,
  // Y CREAR UNA ROOM EN FIRESTORE GUARDANDO EL RTDBID
  createUser(callback?, idRoomInput?) {
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

          if (idRoomInput) {
            this.authRoomId(idRoomInput).then(data => {
              if (!data.id) {
                alert(data);
              } else {
                this.connectToRoom();
                callback();
              }
            });
          } else {
            this.createRoom(callback);
          }
        });
    } else {
      alert("Debes colocar un mail.");
    }
  },
  createRoom(callback?) {
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
          if (cs.roomId == null) {
            cs.roomId = res.id.toString();
            this.setState(cs);
          }
          this.connectToRoom();
          callback();
        });
    }
  },
  authRoomId(roomIdInput) {
    const cs = this.getState();

    return fetch(`${API_BASE_URL}/auth/rooms`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomIdInput }),
    })
      .then(data => {
        return data.json();
      })
      .then(res => {
        if (res.id) {
          cs.roomId = res.id;
          return res;
        } else {
          return res.message;
        }
      });
  },
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

  // RECIBIMOS EL ID DE LA RTDB PARA LUEGO PODER QUEDAR
  // ESCUCHANDO SI UNA PERSONA ENVÍA MENSAJES
  connectToRoom() {
    const cs = this.getState();
    if (cs.roomId && cs.userId) {
      fetch(`${API_BASE_URL}/rooms/${cs.roomId}?userId=${cs.userId}`)
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.rtdbRoomId = res.rtdbId;
          this.setState(cs);
          this.listenRoom();
        });
    }
  },
  listenRoom() {
    const cs = this.getState();
    const chatRoomRef = rtdb.ref(`/rooms/${cs.rtdbRoomId}`);

    chatRoomRef.on("value", snapshot => {
      const currentState = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = map(messagesFromServer.messages);
      currentState.messages = messagesList;
      this.setState(cs);
    });
  },

  pushMessages(message: string) {
    const cs = this.getState();
    fetch(`${API_BASE_URL}/rooms/${cs.rtdbRoomId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: cs.name,
        message: message,
      }),
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        return data;
      });
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
