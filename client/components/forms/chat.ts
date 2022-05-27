import { Router } from "@vaadin/router";
import { state } from "../../state";

type Message = {
  from: string;
  message: string;
};

class PushMessages extends HTMLElement {
  shadow: ShadowRoot;
  messages: Message[] = [];
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  addListeners() {
    const form = this.shadow.querySelector(".form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const target = e.target as any;

      state.pushMessages(target["msg"].value);
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

      .input {
        height: 30px;
      }

      .btn {
        background-color: #575da9;
        border-style: none;
        border-radius: 4px;
        height: 40px;
        margin-top: 5px;
      }
      .btn:hover {
        cursor: pointer;
      }
    `;

    this.shadow.innerHTML = `
      <form class="form">
        <input autofocus class="input" type="text" name="msg" placeholder="Hey There! Im ussing WhatsGram" require>
        <button class="btn">
          <text-custom weight="bold" size="20px">Enviar</text-custom>
        </button>
      </form>
    `;

    this.shadow.appendChild(style);
    this.addListeners();
  }
}
customElements.define("chat-form", PushMessages);
