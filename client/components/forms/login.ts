class Login extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  addListeners() {}

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

      .btn {
        background-color: #465c88;
        border-style: none;
        border-radius: 4px;
        height: 40px;
        margin-top: 30px;
      }
      .btn:hover {
        cursor: pointer;
      }
    `;

    this.shadow.innerHTML = `
      <form class="form">
        <label name="name" type="text" class="label"><text-custom weight="500" size="20px">Tu nombre:</text-custom>
          <input class="input" type="text" name="name" placeholder="Tu nombre" require>
        </label>

        <label name="email" type="email" class="label"><text-custom weight="500" size="20px">Tu email:</text-custom>
          <input class="input" type="email" name="email" placeholder="pepite@gmail.com" require>
        </label>

        <text-custom weight="500" size="20px">Desea:</text-custom>
        <select class="input-select" type="text" name="select">
          <option value="newRoom">Crear una sala</option>
          <option value="actualRoom">Ingresar a una sala</option>
        </select>

        <button class="btn">Comenzar</button>
      </form>
    `;

    this.shadow.appendChild(style);
    this.addListeners();
  }
}
customElements.define("login-form", Login);
