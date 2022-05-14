import { state } from "../state";

type Message = {
  from: string;
  message: string;
};

class Chat extends HTMLElement {
  shadow: ShadowRoot;
  messages: Message[] = [];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");

    style.innerHTML = `
      .container {
        width: 100%;
      }
      h1 {
        margin: 0 auto;
      }
      .messages {
        width: 100%;
        height: 200px;
      }
    `;
    this.shadow.appendChild(style);
  }
  addListeners() {}

  connectedCallback() {
    state.suscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.render();
    });
  }
  render() {
    const homeDiv = document.createElement("div");
    homeDiv.classList.add("container");
    const cs = state.getState();
    const roomId = cs.roomId;

    homeDiv.innerHTML = `
      <text-custom weight="bold" size="30px">Chat: ${roomId}</text-custom>
    
      <div>
        <div class="messages">
          ${this.messages.map(m => {
            return `<div class="message">${m.from}:${m.message}</div>`;
          })}
        </div>
      </div>

      <chat-form></chat-form>
    `;

    this.shadow.appendChild(homeDiv);
  }
}
customElements.define("chat-page", Chat);
