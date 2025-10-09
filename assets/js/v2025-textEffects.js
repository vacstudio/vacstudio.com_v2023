{

  /** Utility Functions */
  const split = (text, type = "chars") => {
    text.setAttribute("aria-label", text.textContent);
    const splits = new SplitText(text, { type });
    splits[type].forEach((char) => char.setAttribute("aria-hidden", "true"));
    return splits[type];
  };

  const getParams = (item) => {
    const { duration, delay, stagger, ease, type } = item.dataset;
    const params = {
      duration: 1.2,
      delay: 0,
      type: "chars",
    };

    if (duration) params.duration = parseFloat(duration);
    if (delay) params.delay = parseFloat(delay);
    if (type && (type === "chars" || type === "words" || type === "lines"))
      params.type = type;

    return params;
  };

  const baseAnimation = (item) => {
    const params = getParams(item);
    return {
      duration: params.duration,
      delay: params.delay,
      ease: "expo.out",
      //   stagger each item so the letters come in one after the other
      stagger: {
        each: 0.04,
        from: "start",
      },
      scrollTrigger: {
        trigger: item,
        // use scrolltrigger to trigger on enter and reset on exit
        toggleActions: "play reset play reset",
      },
    };
  };

  /** (1) Split Reveal Animation */
  function createSplitRevealAnimation(item) {
    const params = getParams(item); // 1. get params from attributes
    const text = split(item, params.type); // 2. split the text
    item.style.overflow = "hidden"; // 3. set container to overflow

    // 4. create the animation
    return gsap.fromTo(
      text,
      { yPercent: 120 },
      {
        ...baseAnimation(item),
        yPercent: 0,
      }
    );
  }

  function createScrambledAnimation(item) {
    const text = item.textContent;
    const randomText = Array(text.length)
      .fill()
      .map(() => String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65)))
      .join("")
      .toLowerCase();

    return gsap.fromTo(
      item.children[0],
      {
        scrambleText: randomText,
      },
      {
        ...baseAnimation(item),
        scrambleText: text,
        chars: text,
      }
    );
  }

  function createAlphaAnimation(item) {

    const params = getParams(item); // 1. get params from attributes
    const text = split(item, "chars"); // 2. split the text

    return gsap.fromTo(
      text,
      { autoAlpha: 0 },
      {
        ...baseAnimation(item),
        autoAlpha: 1,
        stagger: {
          each: 0.02,
          from: "random",
        },
      }
    );
  }

  function createSideAnimation(item) {
    const params = getParams(item);
    const outer = split(item, "chars");
    outer.forEach((char) => {
      char.style.overflow = "hidden";
    });
    const inner = split(item.children[0], "chars");

    return gsap.fromTo(
      inner,
      { x: 100 },
      {
        ...baseAnimation(item),
        x: 0,
        stagger: {
          each: 0.02,
          from: "end",
        },
      }
    );
  }

  function createUpDownAnimation(item) {
    const params = getParams(item);
    const outer = split(item, "chars");
    outer.forEach((char) => {
      char.style.overflow = "hidden";
    });
    const inner = split(item.children[0], "chars");

    return gsap.fromTo(
      inner,
      {
        yPercent: (i) => {
          return i % 2 === 0 ? 100 : -100;
        },
      },
      {
        ...baseAnimation(item),
        yPercent: 0,
        stagger: {
          each: 0.02,
          from: "random",
        },
      }
    );
  }

  /** Main Text Effect Wrapper */
  addEventListener("GSAPReady", (event) => {
    const texts = [...document.querySelectorAll('[data-animate="text"]')];

    texts.forEach((item) => {
      if (item.dataset.type === "chars") createSplitRevealAnimation(item);
      else if (item.dataset.type === "words") createSplitRevealAnimation(item);
      else if (item.dataset.type === "scramble") createScrambledAnimation(item);
      else if (item.dataset.type === "alpha") createAlphaAnimation(item);
      else if (item.dataset.type === "side") createSideAnimation(item);
      else if (item.dataset.type === "updown") createUpDownAnimation(item);
    });
  });

}
