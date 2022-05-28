class Home extends HTMLElement {
  shadow: ShadowRoot;
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
    `;
    this.shadow.appendChild(style);
  }
  addListeners() {}

  connectedCallback() {
    this.render();
  }
  render() {
    const homeDiv = document.createElement("div");
    homeDiv.classList.add("container");

    homeDiv.innerHTML = `
      <text-custom weight="bold" size="25px">WhatsGram</text-custom>

      <login-form></login-form>
    `;

    this.shadow.appendChild(homeDiv);
    this.addListeners();
  }
}
customElements.define("home-page", Home);
