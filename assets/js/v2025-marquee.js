addEventListener("GSAPReady", (event) => {
  // console.log("marquee");
  const wrapper = document.querySelector("[data-animate='marquee']");
  if (!wrapper) return;

  const sections = [...wrapper.querySelectorAll("[data-marquee='line']")];

  gsap.fromTo(
    sections,
    {
      x: (i) =>
        i % 2 === 0
          ? sections[i].offsetWidth / 4
          : -sections[i].offsetWidth / 4,
    },
    {
      x: (i) =>
        i % 2 === 0
          ? -sections[i].offsetWidth / 4
          : sections[i].offsetWidth / 4,
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // invalidateOnRefresh: true,
      },
    }
  );
});
