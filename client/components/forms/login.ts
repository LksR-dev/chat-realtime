import { Router } from "@vaadin/router";
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
            <input class="input" type="text" name="id" placeholder="1400">
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
          state.setEmailAndName(userEmail, userName);
          const cs = state.getState();
          if (cs.rtdbRoomId && cs.userId) {
            Router.go("/chat");
          } else {
            state.createUser(() => {
              Router.go("/chat");
            });
          }
        }
        if (select == "actualRoom") {
          const currentState = state.getState();
          if (idRoomInput !== "") {
            state.setEmailAndName(userEmail, userName);

            if (currentState.rtdbRoomId && currentState.userId) {
              Router.go("/chat");
            } else {
              state.createUser(() => {
                Router.go("/chat");
              }, idRoomInput);
            }
          }
        }
      } else {
        alert("Debes completar todos los campos");
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
