import { state } from "../../state";

class Login extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  addListeners() {
    const form: HTMLElement = this.shadow.querySelector("form");
    const selectRoom: HTMLElement = this.shadow.querySelector("select");
    const idContainer = this.shadow.querySelector(".id__container");

    selectRoom.addEventListener("change", e => {
      const target = e.target as any;
      const selection = target.value;

      if (selection == "newRoom") {
        idContainer.innerHTML = ``;
      }
      if (selection == "actualRoom") {
        idContainer.innerHTML = `
          <label class="label" type="text" name="id">
            <text-custom weight="500" size="20px">Ingrese el ID de la sala:</text-custom>
            <input class="input" type="text" name="id" placeholder="7CE24">
          </label>
        `;
      }
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      const target = e.target as any;
      const userName = target.name.value;
      const userEmail = target.email.value;
      const select = target.select.value;
      const idRoomInput = target.id.value;

      if (userEmail !== "" && userName !== "") {
        if (select == "newRoom") {
          if (idRoomInput !== "") {
            state.setName(userName);
            state.setEmail(userEmail);

            const authUser = state.getAuth(userEmail);
            authUser.then(id => {
              // SI EL EMAIL DEL USUARIO NO EXISTE, CREA UN USUARIO NUEVO
              if (!id.id) {
                const newUser = state.createUser(userName, userEmail);
                newUser.then(userId => {
                  if (userId.id) {
                    const newUserId = userId.id;

                    const newRoom = state.createRoom(newUserId);
                    newRoom.then(roomId => {
                      state.setRoomId(roomId.id);
                      const newRoomId = roomId.id;

                      const connectToRoom = state.connectToRoom(
                        newRoomId,
                        newUserId
                      );
                      connectToRoom.then(data => {
                        state.setLongRoomId(data.rtdbId);
                      });
                    });
                  }
                });
              } else {
                return id.id;
              }
            });
          }
        }
      } else {
        alert("Debes llenar todos los campos");
      }
    });
  }

  connectedCallback() {
    this.render();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `
      .form {
        display: flex;
        flex-direction: column;
      }

      .label {
        display: flex;
        flex-direction: column;
      }
      .label:first-child{
        margin-top: 15px;
      }
      
      .input {
        height: 30px;
        margin-bottom: 15px;
      }

      .select {
        height: 30px;
      }

      .btn {
        background-color: #465c88;
        border-style: none;
        border-radius: 4px;
        height: 40px;
        margin-top: 20px;
      }
      .btn:hover {
        cursor: pointer;
      }
    `;

    this.shadow.innerHTML = `
      <form class="form">
        <label name="name" type="text" class="label">
          <text-custom weight="500" size="20px">Tu nombre:</text-custom>
          <input class="input" type="text" name="name" placeholder="Tu nombre" require>
        </label>

        <label name="email" type="email" class="label">
          <text-custom weight="500" size="20px">Tu email:</text-custom>
          <input class="input" type="email" name="email" placeholder="pepite@gmail.com" require>
        </label>

        <text-custom weight="500" size="20px">Deseo:</text-custom>
        <select class="select" type="text" name="select">
          <option value="newRoom">Crear una sala</option>
          <option value="actualRoom">Ingresar a una sala</option>
        </select>

        <div class="id__container"></div>

        <button class="btn">
          <text-custom weight="bold" size="20px">Comenzar</text-custom>
        </button>
      </form>
    `;

    this.shadow.appendChild(style);
    this.addListeners();
  }
}
customElements.define("login-form", Login);
