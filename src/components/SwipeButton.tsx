import { useMotionValue, motion, useAnimate } from "framer-motion";
import {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function SwipeButton(props: { setStatus(arg0: string): void }) {
  const minSwiperWidth = 60;
  const swiperWidth = useMotionValue(minSwiperWidth);
  const swiperBackgroundRef = useRef<JSX.Element>();
  const [swiperScope, swiperAnimate] = useAnimate();

  const lastEventTs = useRef(0);

  // X coordinate of the mouse / touch when it was started
  const startX = useRef(0);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const currentX = event.screenX;
      const maxSwiperWidth = (swiperBackgroundRef.current as any).offsetWidth;
      console.log(
        `Mouse moved. Start X: ${startX.current}. Current X: ${currentX}. Max swiper width: ${maxSwiperWidth}`,
      );
      const deltaX = currentX - startX.current;

      let newSwiperWidth = minSwiperWidth + deltaX;
      newSwiperWidth = Math.max(newSwiperWidth, minSwiperWidth);
      newSwiperWidth = Math.min(newSwiperWidth, maxSwiperWidth);

      swiperWidth.set(newSwiperWidth);
    },
    [swiperWidth],
  );

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      console.log("Mouse up", event);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      swiperAnimate(swiperScope.current, {
        width: minSwiperWidth,
      });
    },
    [onMouseMove, swiperScope, swiperAnimate],
  );

  const onMouseDown = (event: any) => {
    console.log("Mouse down", event);
    startX.current = event.screenX;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      const now = Date.now();
      console.log("Touch move", now - lastEventTs.current, event);
      lastEventTs.current = now;
      const currentX = event.touches[0].screenX;
      const maxSwiperWidth = (swiperBackgroundRef.current as any).offsetWidth;
      console.log(
        `Touch moved. Start X: ${startX.current}. Current X: ${currentX}. Max swiper width: ${maxSwiperWidth}`,
      );
      const deltaX = currentX - startX.current;

      let newSwiperWidth = minSwiperWidth + deltaX;
      newSwiperWidth = Math.max(newSwiperWidth, minSwiperWidth);
      newSwiperWidth = Math.min(newSwiperWidth, maxSwiperWidth);

      swiperWidth.set(newSwiperWidth);
    },
    [swiperWidth],
  );

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
      console.log("Touch end", event);
      props.setStatus("");
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      swiperAnimate(swiperScope.current, {
        width: minSwiperWidth,
      });
    },
    [onTouchMove, swiperScope, swiperAnimate, props],
  );

  const onTouchStart = (event: any) => {
    console.log("Touch start", event);
    props.setStatus("Touch start");
    lastEventTs.current = Date.now();
    startX.current = event.touches[0].screenX;

    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  };

  return (
    <div className="w-full relative select-none">
      <div
        ref={swiperBackgroundRef as any}
        className="bg-secondary text-secondary-foreground p-4 rounded-full w-full text-center"
      >
        Swipe to send
      </div>
      <motion.div
        ref={swiperScope}
        className="absolute top-0 h-full bg-primary rounded-full"
        style={{
          width: swiperWidth,
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      ></motion.div>
    </div>
  );
}
