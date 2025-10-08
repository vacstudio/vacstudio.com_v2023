{
  const params = {
    duration: 0.8,
    ease: "expo.out",
  };

  const handleSecondaryVisibility = (secondary) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(secondary, {
              yPercent: 200,
              ...params,
            });
          } else {
            gsap.to(secondary, {
              yPercent: 0,
              ...params,
            });
          }
        });
      },
      {
        threshold: 0.02,
        rootMargin: "-10% 0px",
      }
    );

    const contentElement = document.getElementById("content");
    if (contentElement) {
      observer.observe(contentElement);
    }
  };

  addEventListener("GSAPReady", (event) => {
    const wrapper = document.querySelector("[data-module='nav']");
    if (!wrapper) return;
    const main = wrapper.children[0];
    const secondary = wrapper.children[1].children[0];

    handleSecondaryVisibility(secondary);
  });
}

{
  /** Section Selector   */
  const createObserver = (section, cb) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          cb(entry.target);
        }
      });
    }, {
      threshold: 0.2 // This means the callback will fire when at least 10% is visible
    });
    observer.observe(section);
  };

  addEventListener("GSAPReady", (event) => {
    const { lenis } = event.detail;

    const wrapper = document.querySelector("[data-animate='sectionselector']");
    const items = [...wrapper.children];
    const highlight = wrapper.querySelector("[data-selector='highlight']");
    let currentIndex = 0;

    const sections = [...document.querySelectorAll("section")];

    sections.forEach((section, index) => {
      createObserver(section, () => {
        items[currentIndex].classList.remove("current");
        currentIndex = index;
        items[currentIndex].classList.add("current");
        moveHighlightTo(index);
      });
    });

    let flipAnimation = null
      const moveHighlightTo = (index) => {
        const state = Flip.getState(highlight);
        items[index].appendChild(highlight);

    if (flipAnimation) flipAnimation.kill()
    flipAnimation = Flip.from(state, {
          duration: 0.5,
          ease: "expo.out",
        });
      };

      items.forEach((item, index) => {
        item.addEventListener("click", () => {
          lenis.scrollTo("#" + items[index].dataset.to);
        });

        item.addEventListener("mouseenter", () => {
          moveHighlightTo(index);
        });

        item.addEventListener("mouseleave", () => {
          moveHighlightTo(currentIndex);
        });
      });
    });
  }