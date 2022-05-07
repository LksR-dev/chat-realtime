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
      divEl.className = "text";

      divEl.innerHTML = this.textContent;
      style.innerHTML = `
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
