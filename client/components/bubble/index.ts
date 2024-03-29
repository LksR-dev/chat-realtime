class UserMessage extends HTMLElement {
  user: string;
  message: string;
  constructor() {
    super();
    this.render();
  }
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const text = this.getAttribute("text");
    const userName = this.getAttribute("username");
    const color = this.getAttribute("color");
    const textalign = this.getAttribute("textalign") || "left";

    const style = document.createElement("style");
    style.textContent = `
    .bubble{
      width: max-content;
      max-width: 250px;
      border-radius: 5px;
      background-color: ${color};
      padding: 8px;
    }
    .message-text{
      text-align: ${textalign};
      word-break: break-word;
    }
    
    .username{
      text-align: ${textalign};
      word-break: break-word;
      }
    `;

    const div = document.createElement("div");
    div.classList.add("bubble");
    div.innerHTML = `
      <text-custom class="username" weight="bold" size="16px">${userName}</text-custom>
      <text-custom class="message-text" weight="400" size="16px">${text}</text-custom>
    `;

    shadow.appendChild(style);
    shadow.appendChild(div);
  }
}
customElements.define("user-bubble", UserMessage);
