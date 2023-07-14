"use client";

import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";
import styles from "@/app/scss/utils/Overlay.module.css";

function Overlay() {
  const counterRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const counter = counterRef.current;
    const loader = loaderRef.current;

    gsap.fromTo(
      counter,
      { textContent: "000" },
      {
        duration: 500,
        textContent: "100",
        ease: "power1.out",
        snap: { textContent: 1 },
        onUpdate: function () {
          counter.textContent = leadingZeroes(
            Math.floor(this.targets()[0].textContent),
            3
          );
        },
        onComplete: function () {
          if (loader && loader.parentNode) {
            // Check if loader and its parent exist
            gsap.to(loader, {
              duration: 1,
              yPercent: -100,
              ease: "power1.inOut",
              onComplete: function () {
                loader.parentNode.removeChild(loader);
              }
            });
          }
        }
      }
    );

    function leadingZeroes(number, length) {
      let num = parseInt(number);
      return num.toString().padStart(length, "0");
    }
  }, []);

  return (
    <div className={styles.loader} ref={loaderRef}>
      <div className={styles["loader-counter"]}>
        <div className={styles["loader-container"]}>
          <div className={styles["loader-percent"]} ref={counterRef}>
            000
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overlay;
