import gsap from "gsap";

export default class Magnetic {
  constructor(el, options = {}) {
    this.el = el;
    this.options = {
      y: 0.2,
      x: 0.2,
      s: 0.2,
      rs: 0.7,
      ...options
    };

    this.y = 0;
    this.x = 0;
    this.width = 0;
    this.height = 0;

    this.bind();
  }

  bind() {
    this.el.addEventListener("mouseenter", () => {
      const rect = this.el.getBoundingClientRect();
      this.y = rect.top - window.pageYOffset;
      this.x = rect.left - window.pageXOffset;
      this.width = rect.width;
      this.height = rect.height;
    });

    this.el.addEventListener("mousemove", (e) => {
      const y = (e.clientY - this.y - this.height / 2) * this.options.y;
      const x = (e.clientX - this.x - this.width / 2) * this.options.x;

      this.move(x, y, this.options.s);
    });

    this.el.addEventListener("mouseleave", () => {
      this.move(0, 0, this.options.rs);
    });
  }

  move(x, y, speed) {
    gsap.to(this.el, {
      y,
      x,
      force3D: true,
      overwrite: true,
      duration: speed
    });
  }
}
