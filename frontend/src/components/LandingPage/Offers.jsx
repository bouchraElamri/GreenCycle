import React, { useEffect, useRef, useState } from "react";
import Offerpic from "../../assets/Offerpic.png";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const Offers = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = null;

    const updateProgress = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.9;
      const end = viewportHeight * 0.3;
      const ratio = clamp((start - rect.top) / (start - end), 0, 1);
      setProgress(ratio);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative z-20 bg-white-intense py-10 md:py-15">
      <div className="mx-6 md:mx-24 xl:mx-38">
        <div className="relative md:hidden pt-10">
          <h2 className="pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 whitespace-nowrap text-center font-nexa text-5xl font-bold leading-[0.92] text-green-dark/90">
            Do Not Miss This
          </h2>

          <article className="relative z-10 overflow-hidden rounded-[40px] shadow-[0_0_34px_rgba(0,0,0,0.18)]">
            <img src={Offerpic} alt="Offer" className="h-72 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-dark/65 via-green-dark/20 to-transparent" />
            <div className="absolute left-5 top-5 z-10 font-nexa text-white-intense">
              <p className="text-4xl leading-none">50% OFF</p>
              <p className="text-4xl leading-none">For Pets</p>
              <p className="text-4xl leading-none">Items</p>
            </div>
          </article>
        </div>

        <div className="relative hidden h-[420px] md:block">
          <article
            className="absolute top-1/2 md:left-[55%] xl:left-1/2 z-20 w-[72%] max-w-[920px] -translate-y-1/2 overflow-hidden rounded-[32px] shadow-[0_24px_48px_rgba(0,0,0,0.24)]"
            style={{
              transform: `translate(-50%, -50%) translateX(${-180 * progress}px)`,
            }}
          >
            <img src={Offerpic} alt="Offer" className="md:h-[300px] xl:h-[350px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-dark/65 via-green-dark/20 to-transparent" />
            <div className="absolute left-6 top-6 z-10 font-nexa text-white-intense">
              <p className="text-6xl leading-none">50% OFF</p>
              <p className="text-6xl leading-none">For Pets</p>
              <p className="text-6xl leading-none">Items</p>
            </div>
          </article>

          <div
            className="absolute md:left-[74%] xl:left-[72%] top-1/2 z-10 -translate-y-1/2 text-left font-nexa text-green-dark"
            style={{
              transform: `translateY(-50%) translateX(${-140 * (1 - progress)}px)`,
              opacity: 0.2 + progress * 0.8,
            }}
          >
            <h2 className="md:text-7xl xl:text-8xl font-bold leading-[0.92]">Do Not</h2>
            <h2 className="md:text-7xl xl:text-8xl font-bold leading-[0.92]">Miss</h2>
            <h2 className="md:text-7xl xl:text-8xl font-bold leading-[0.92]">This</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
