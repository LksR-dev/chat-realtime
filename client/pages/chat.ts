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
        height: 280px;
        display: flex;
        flex-direction: column;
        overflow: auto;
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

    const cs = state.getState();
    chatSection.innerHTML = `
      <text-custom weight="bold" size="30px">Chat: ${cs.roomId}</text-custom>

      <div class="chat"></div>

      <chat-form></chat-form>
    `;

    const chat = chatSection.querySelector(".chat");
    function createBubble(messages: Message[]) {
      for (const message of messages) {
        console.log(message);

        const cs = state.getState();
        const bubble = document.createElement("div");

        if (message.from === cs.name) {
          bubble.innerHTML = `
            <user-bubble username="${message.from}" text="${message.message}" color="#7a9d96" textalign="right"></user-bubble>
          `;
          bubble.className = "bubble__owner";
          chat.appendChild(bubble);
        }
        if (message.from !== cs.name) {
          bubble.innerHTML = `
            <user-bubble username="${message.from}" text="${message.message}" color="#cae4db" textalign="left"></user-bubble>
          `;
          bubble.className = "bubble__guest";
          chat.appendChild(bubble);
        }
      }
    }
    createBubble(this.messages);
    chat.scrollTo({
      top: 1000,
      left: 0,
      behavior: "auto",
    });

    this.shadow.appendChild(chatSection);
  }
}
customElements.define("chat-page", Chat);
