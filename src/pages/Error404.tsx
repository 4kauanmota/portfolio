import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Error404.module.scss";
import BlackHoleStar from "../models/BlackHoleStar";
import Spaceship from "../components/atoms/Spaceship";

const Error404 = () => {
  const navigate = useNavigate();

  const errorPage = useRef(null);
  const errorText = useRef(null);
  const errorArea = useRef(null);
  const blackHole = useRef(null);

  let collapse = true;
  let expanse = false;
  let currentTime = 0;

  const errorClick = () => {
    const errorPageElement = errorPage.current;
    const errorAreaElement = errorArea.current;

    errorPageElement.style.opacity = 0;
    errorPageElement.style.transform = "scale(2)";
    errorAreaElement.classList.add("open");

    collapse = false;
    expanse = true;

    if (expanse) {
      errorArea.current.remove();
      errorText.current.remove();
    }
  };

  const errorMouseOver = () => {
    if (expanse == false) {
      collapse = false;

      if (collapse == false) {
        errorText.current.style.opacity = 0;
      }
    }
  };

  const errorMouseOut = () => {
    if (expanse == false) {
      collapse = true;

      if (collapse == true) {
        errorText.current.style.opacity = 1;
      }
    }
  };

  (window as any).requestFrame = (() => {
    return (
      window.requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      function (callback: any) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  const goBack = () => {
    errorClick();

    setTimeout(() => {
      navigate("/");
    }, 8000);
  };

  useEffect(() => {
    const errorPageElement = errorPage.current;

    const cw = errorPageElement.clientWidth;
    const ch = errorPageElement.clientHeight;

    const startTime = new Date().getTime();

    const blackHoleStars: any = [];

    const canvas = blackHole.current;
    canvas.width = cw;
    canvas.height = ch;

    const context = canvas.getContext("2d");
    if (context) {
      context.globalCompositeOperation = "multiply";
    } else {
      console.error("Unable to get 2D context for canvas");
    }

    const setDPI = (canvas: HTMLCanvasElement, dpi: number) => {
      const context = canvas.getContext("2d");

      if (!canvas.style.width) {
        canvas.style.width = canvas.width + "px";
      }
      if (!canvas.style.height) {
        canvas.style.height = canvas.height + "px";
      }

      const scaleFactor = dpi / 96;
      canvas.width = Math.ceil(canvas.width * scaleFactor);
      canvas.height = Math.ceil(canvas.height * scaleFactor);

      context.scale(scaleFactor, scaleFactor);
    };

    const loop = () => {
      var now = new Date().getTime();
      currentTime = (now - startTime) / 50;

      context.fillStyle = "rgba(0,0,0,0.1)";
      context.fillRect(0, 0, cw, ch);

      for (var i = 0; i < blackHoleStars.length; i++) {
        blackHoleStars[i].draw(expanse, collapse, currentTime, context);
      }

      (window as any).requestFrame(loop);
    };

    const init = () => {
      context.fillStyle = "rgba(0,0,0,1)";
      context.fillRect(0, 0, cw, ch);

      for (var i = 0; i < 2500; i++) new BlackHoleStar(cw, ch, blackHoleStars);

      loop();
    };

    setDPI(canvas, 192);
    init();

    const autoTimeout = setTimeout(() => {
      errorClick();

      setTimeout(() => {
        navigate("/");
      }, 12000);
    }, 100000);

    return () => {
      clearTimeout(autoTimeout);
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <>
      <Spaceship />

      <section ref={errorPage} id={styles.blackhole}>
        <div ref={errorText} className={styles.errorText}>
          <h1>ERROR 404 / PAGE NOT FOUND</h1>
          <p>
            <span>
              You've wandered far, traveler. This page doesn't exist, but
            </span>{" "}
            luckily we have a portal here that can take you back to the main
            page
          </p>
        </div>

        <a onClick={goBack}>
          <div
            ref={errorArea}
            className={styles.errorArea}
            onClick={errorClick}
            onMouseOver={errorMouseOver}
            onMouseOut={errorMouseOut}
          >
            <span>Click here</span>
          </div>
        </a>

        <canvas ref={blackHole} />
      </section>
    </>
  );
};

export default Error404;
