customElements.define(
  "text-custom",
  class extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.render();
    }
    render() {
      this.shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      const divEl = document.createElement("div");
      const width = this.getAttribute("size") || "18px";
      const weight = this.getAttribute("weight") || "400";
      divEl.classList.add("text");
      divEl.classList.add("container");

      divEl.innerHTML = this.textContent;
      style.innerHTML = `
      .container {
        width: 100%;
      }
      .text {
        font-size: ${width};
        font-weight: ${weight};
      }
      `;

      this.shadow.appendChild(divEl);
      this.shadow.appendChild(style);
    }
  }
);
