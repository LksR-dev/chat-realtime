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
      .chat {
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        overflow: auto;
      }
      
      @media only screen and (min-width: 375px) {
        .chat {
          height: 300px;
        }
      }
      @media only screen and (min-width: 480px) {
        .chat {
          height: 300px;
        }
      }

      .bubble__owner {
        margin: 0 0 2px auto;
      }
      .bubble__guest {
        margin-bottom: 2px;
      }
    `;
    this.shadow.appendChild(style);
  }
  connectedCallback() {
    state.suscribe(() => {
      const cs = state.getState();
      if (
        cs.roomId !== "" &&
        cs.messages.length != 0 &&
        this.messages.length < cs.messages.length
      ) {
        this.messages = cs.messages;
        this.messages.shift();
        this.shadow.lastChild.remove();
        this.render();
      }
    });
    const cs = state.getState();
    this.messages = cs.messages;
    this.render();
  }
  render() {
    const chatSection = document.createElement("div");
    chatSection.classList.add("container");

    const bubbles = [];
    for (const message of this.messages) {
      const cs = state.getState();
      if (message.from === cs.name) {
        bubbles.push(
          `<user-bubble class="bubble__owner" username="${message.from}" text="${message.message}" color="#7a9d96" textalign="right"></user-bubble>`
        );
      } else {
        bubbles.push(`
            <user-bubble class="bubble__guest" username="${message.from}" text="${message.message}" color="#cae4db" textalign="left"></user-bubble>
          `);
      }
    }

    const cs = state.getState();
    chatSection.innerHTML = `
      <text-custom weight="bold" size="30px">Chat: ${cs.roomId}</text-custom>

      <div class="chat">
      ${bubbles.join("")}
      </div>

      <chat-form class="form__chat"></chat-form>
    `;

    this.shadow.appendChild(chatSection);
    const chat = chatSection.querySelector(".chat");
    chat.scrollTo({
      top: 1000,
      left: 0,
      behavior: "auto",
    });
  }
}
customElements.define("chat-page", Chat);
