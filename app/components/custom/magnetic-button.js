"use client";

import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";
import styles from "@/app/scss/comps/customs/MagneticButton.module.css";

const lerp = (a, b, n) => (1 - n) * a + n * b;
const calcWinsize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});
const getMousePos = (e) => ({ x: e.clientX, y: e.clientY });
const distance = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
const getRandomFloat = (min, max) =>
  (Math.random() * (max - min) + min).toFixed(2);

const MagneticButton = ({ buttonText }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    let winsize = calcWinsize();
    const onResize = () => {
      winsize = calcWinsize();
    };
    window.addEventListener("resize", onResize);

    let mousepos = { x: 0, y: 0 };
    const onMouseMove = (ev) => {
      mousepos = getMousePos(ev);
    };
    window.addEventListener("mousemove", onMouseMove);

    let buttonCtrl;

    const initButtonCtrl = () => {
      buttonCtrl = new ButtonController(buttonRef.current);
      buttonCtrl.init();
    };

    const showTextWithoutHover = () => {
      buttonCtrl.enter(); // Show the text without hover
    };

    class ButtonController {
      constructor(el) {
        this.DOM = {
          el,
          filler: el.querySelector(`.${styles.buttonFiller}`),
          text: el.querySelector(`.${styles.buttonText}`),
          textInner: el.querySelector(`.${styles.buttonTextInner}`)
        };
        this.renderedStyles = {
          tx: { previous: 0, current: 0, amt: 0.1 },
          ty: { previous: 0, current: 0, amt: 0.1 }
        };
        this.state = { hover: false };
        this.calculateSizePosition();
        this.initEvents();
        requestAnimationFrame(() => this.render());
      }

      calculateSizePosition() {
        this.rect = this.DOM.el.getBoundingClientRect();
        this.distanceToTrigger = this.rect.width * 0.7;
      }

      initEvents() {
        window.addEventListener(
          "resize",
          this.calculateSizePosition.bind(this)
        );
      }

      render() {
        const { x: mouseX, y: mouseY } = mousepos;
        const { left, width, top, height } = this.rect;

        const distanceMouseButton = distance(
          mouseX + window.scrollX,
          mouseY + window.scrollY,
          left + width / 2,
          top + height / 2
        );

        let x = 0;
        let y = 0;

        if (distanceMouseButton < this.distanceToTrigger) {
          if (!this.state.hover) {
            this.enter();
          }
          x = (mouseX + window.scrollX - (left + width / 2)) * 0.3;
          y = (mouseY + window.scrollY - (top + height / 2)) * 0.3;
        } else if (this.state.hover) {
          this.leave();
        }

        this.renderedStyles.tx.current = x;
        this.renderedStyles.ty.current = y;

        for (const key in this.renderedStyles) {
          const { previous, current, amt } = this.renderedStyles[key];
          this.renderedStyles[key].previous = lerp(previous, current, amt);
        }

        const { tx, ty } = this.renderedStyles;
        this.DOM.el.style.transform = `translate3d(${tx.previous}px, ${ty.previous}px, 0)`;
        this.DOM.text.style.transform = `translate3d(${-tx.previous * 0.6}px, ${
          -ty.previous * 0.6
        }px, 0)`;

        requestAnimationFrame(() => this.render());
      }

      enter() {
        this.state.hover = true;
        this.DOM.el.classList.add(styles.buttonHover);
        document.body.classList.add(styles.active);

        gsap.killTweensOf(this.DOM.filler);
        gsap.killTweensOf(this.DOM.textInner);

        gsap
          .timeline()
          .to(this.DOM.filler, {
            duration: 0.5,
            ease: "power3.out",
            startAt: { y: "75%" },
            y: "0%"
          })
          .to(
            this.DOM.textInner,
            {
              duration: 0.1,
              ease: "power3.out",
              opacity: 0,
              y: "-10%"
            },
            0
          )
          .to(
            this.DOM.textInner,
            {
              duration: 0.25,
              ease: "power3.out",
              opacity: 1,
              startAt: { y: "30%", opacity: 1 },
              y: "0%"
            },
            0.1
          );
      }

      leave() {
        this.state.hover = false;
        this.DOM.el.classList.remove(styles.buttonHover);
        document.body.classList.remove(styles.active);

        gsap.killTweensOf(this.DOM.filler);
        gsap.killTweensOf(this.DOM.textInner);

        gsap
          .timeline()
          .to(this.DOM.filler, {
            duration: 0.4,
            ease: "power3.out",
            y: "-75%"
          })
          .to(
            this.DOM.textInner,
            {
              duration: 0.1,
              ease: "power3.out",
              opacity: 0,
              y: "10%"
            },
            0
          )
          .to(
            this.DOM.textInner,
            {
              duration: 0.25,
              ease: "power3.out",
              opacity: 1,
              startAt: { y: "-30%", opacity: 1 },
              y: "0%"
            },
            0.1
          );
      }

      destroy() {
        window.removeEventListener(
          "resize",
          this.calculateSizePosition.bind(this)
        );
      }

      init() {
        this.enter();
        this.leave();
      }
    }

    if (buttonRef.current) {
      initButtonCtrl();
      showTextWithoutHover();
    }

    return () => {
      if (buttonCtrl) {
        buttonCtrl.destroy();
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <button className={styles.magneticButton} ref={buttonRef}>
      <div className={styles.buttonFiller}></div>
      <span className={styles.buttonText}>
        <span className={styles.buttonTextInner}>{buttonText}</span>
      </span>
    </button>
  );
};

export default MagneticButton;
