const split = (text, type = "chars") => {
  text.setAttribute("aria-label", text.textContent);
  const splits = new SplitText(text, { type });
  splits[type].forEach((char) => char.setAttribute("aria-hidden", "true"));
  return splits[type];
};

addEventListener("GSAPReady", (event) => {

  const section = document.querySelector("[data-animate='videogrow']");
  const video = section.querySelector("[data-videogrow='video']");
  const img = video.children[0];

  const title = split(
    section.querySelector("[data-videogrow='title']"),
    "chars"
  );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top center",
      end: "bottom bottom+=100%",
      invalidateOnRefresh: true,
      scrub: 1,
    },
  });
  
  gsap.set(
    title, 
      {
      scale: 0,
      rotation: (i) => Math.random() * 360 - 180,
    })

  tl.to(
    title,
    {
      scale: 1,
      duration: 0.2,
      rotation: 0,
      ease: "expo.out",
      stagger: {
        each: 0.05,
        from: "random",
      },
    }
  );

  tl.fromTo(
    video,
    {
      clipPath: "inset(10% 50% 10% 50%)",
      yPercent: 100,
    },
    {
      ease: "power3",
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
      yPercent: 0,
    },
    ".3"
  );

  tl.fromTo(
    video,
    {
      scale: 0.5,
      // rotation: 180,
    },
    {
      ease: "back.inOut(.2)",
      scale: 1,
      duration: 0.8,
      // rotation: 0,
    },
    "<"
  );

  tl.fromTo(
    img,
    {
      scale: 2.8,
      yPercent: 40,
    },
    {
      scale: 1.2,
      duration: 0.8,
      delay: 0.2,
      yPercent: 0,
    },
    "<"
  );

  tl.to(video, {
    scale: 0.9,
    ease: "linear",
  });

  tl.to(
    img,
    {
      scale: 1,
      ease: "linear",
    },
    "<"
  );
});
