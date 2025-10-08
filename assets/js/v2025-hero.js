{
  const split = (text, type = "chars") => {
    // Handle both single elements and arrays of elements
    const elements = Array.isArray(text) ? text : [text];

    // Set aria labels
    elements.forEach((element) => {
      if (element && typeof element.setAttribute === "function") {
        element.setAttribute("aria-label", element.textContent);
      }
    });

    // Split text and set aria-hidden
    const splits = new SplitText(text, { type });
    splits[type].forEach((char) => {
      if (char && typeof char.setAttribute === "function") {
        char.setAttribute("aria-hidden", "true");
      }
    });

    return splits[type];
  };

  /** -- Setup and Utils */

  let titleSplit,
    parSplit,
    layerItems,
    isIn = false;

  const animateIn = async (delay = 0) => {
    isIn = true;
    animateStripesOut();

    gsap.to(parSplit, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.8,
      delay: 0.65,
      ease: "expo.out",
      stagger: {
        each: 0.08,
      },
    });

    await gsap.to(titleSplit.flat(), {
      yPercent: 0,
      duration: 1.2,
      delay: delay,
      ease: "expo.out",
      stagger: {
        each: 0.01,
        from: "end",
      },
    });
  };

  const animateOut = async () => {
    isIn = false;
    animateStripesIn();

    gsap.to(parSplit, {
      autoAlpha: 0,
      yPercent: 100,
      duration: 0.8,
      ease: "expo.out",
      stagger: {
        each: 0.08,
      },
    });

    await gsap.to(titleSplit.flat(), {
      yPercent: 110,
      duration: 0.8,
      ease: "expo.out",
      delay: 0.1,
      stagger: {
        each: 0.01,
        from: "center",
      },
    });
  };

  /** -- Scribble Animaiton */
  let isScribbling = false;
  const SCRIBBLE_CONFIG = {
    ROTATION_RANGE: 20,
    TIME_BETWEEN_SCRIBBLES: 0.015,
    VISIBILITY_DURATION: 0.01,
    REVERSE_ORDER: true,
  };

  const animateScribble = (scribble) => {
    if (isScribbling) return;
    isScribbling = true;

    gsap.set(scribble, { autoAlpha: 0, rotation: 0 });

    const tl = gsap.timeline();

    const scribblesToAnimate = [...scribble].reverse();

    scribblesToAnimate.forEach((item, index) => {
      const randomRotation =
        Math.random() * SCRIBBLE_CONFIG.ROTATION_RANGE -
        SCRIBBLE_CONFIG.ROTATION_RANGE / 2;
      const baseDelay = index * SCRIBBLE_CONFIG.TIME_BETWEEN_SCRIBBLES;

      tl.add(
        gsap.set(item, {
          autoAlpha: 1,
          rotation: randomRotation,
          delay: baseDelay,
        })
      );

      tl.add(
        gsap.set(item, {
          autoAlpha: 0,
          delay: baseDelay + SCRIBBLE_CONFIG.VISIBILITY_DURATION,
        })
      );
    });

    tl.call(() => {
      isScribbling = false;
    });
  };

  // hero stripes animation
  let heroStripes,
    stripes,
    stripesAnimation = null;

  const calcX = (i) => {
    return i % 2 === 0
      ? -heroStripes[i].scrollWidth
      : heroStripes[i].scrollWidth;
  };

  const animateStripesIn = () => {
    if (stripesAnimation) {
      stripesAnimation.kill();
    }
    
        // play video on the hero
    document.querySelector("video").play()

    gsap.set(heroStripes, {
      autoAlpha: 1,
      x: (i) => calcX(i),
      yPercent: (i) => (heroStripes.length / 2 - i) * 80,
    });

    gsap.set(stripes, {
      rotation: (i) => Math.random() * 30,
      ease: "expo.out",
    });

    stripesAnimation = gsap.to(heroStripes, {
      x: 0,
      delay: 0.2,
      duration: (i) => Math.random() + 1.2,
      ease: "expo.out",
    });
  };

  const animateStripesOut = () => {
    if (stripesAnimation) {
      stripesAnimation.kill();
    }

    stripesAnimation = gsap.to(heroStripes, {
      x: (i) => calcX(i),
      duration: 0.8,
      ease: "expo.out",
    });
  };

  addEventListener("GSAPReady", (event) => {
    const wrapper = document.querySelector("[data-module='hero']");
    if (!wrapper) return;

    const layer = wrapper.querySelector("[data-hero='layer']");
    layerItems = layer.children;
    const title = wrapper.querySelector("[data-hero='title']");
    const toggle = wrapper.querySelector("[data-hero='toggle']");
    const alpha = document.querySelectorAll("[data-hero='alpha']");
    const par = document.querySelectorAll("[data-hero='par']");
    const scribble = [
      ...document.querySelector("[data-hero='scribble']").children[0].children,
    ];

    stripes = [...layer.children];
    heroStripes = stripes.map((item) => item.children[0]);
    gsap.set(heroStripes, { autoAlpha: 0 });

    gsap.to(layer, {
      yPercent: 10,
      scrollTrigger: {
        trigger: layer,
        start: "top top",
        end: "+=100%",
        scrub: true,
      },
    });

    // split
    titleSplit = split(title.children, "chars");
    parSplit = split(par, "lines");

    //   initial state
    gsap.set(titleSplit.flat(), { yPercent: -110 });
    gsap.set(layer, { autoAlpha: 1 });
    gsap.set(toggle, { scale: 3, rotation: 360 });
    gsap.set(parSplit, { autoAlpha: 0, yPercent: 100 });
    gsap.set(alpha, { autoAlpha: 0, scale: 0.7 });
    gsap.set(scribble, { autoAlpha: 0 });

    animateIn(0.6);

    gsap.to(toggle, {
      scale: 1,
      rotation: 0,
      delay: 0,
      duration: 1.2,
      ease: "expo.inOut",
    });

    gsap.to(parSplit, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.8,
      delay: 0.65,
      ease: "expo.out",
      stagger: {
        each: 0.08,
      },
    });

    gsap.to(alpha, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.8,
      delay: 0.9,
      ease: "expo.out",
    });

    toggle.querySelector("input").addEventListener("change", (event) => {
      if (event.target.checked) {
        animateOut();
      } else {
        animateIn();
      }
    });

    toggle.onmouseenter = () => {
      if (!isIn) return;
      // console.log("mouseenter");
      animateScribble(scribble);
    };
  });
}