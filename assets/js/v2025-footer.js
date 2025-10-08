{
  addEventListener("GSAPReady", (event) => {
    const wrapper = document.querySelector("[data-animate='footerlogo']");
    if (!wrapper) return;

    const paths = [...wrapper.querySelectorAll("path")].reverse();
    const lastPath = paths[paths.length - 1];

    // Configuration for the footer logo animation
    const FOOTER_ANIMATION_CONFIG = {
      STAGGER: 0.05,
      VISIBILITY_DURATION: 0.1,
    };

    // Set initial state
    gsap.set(paths, {
      autoAlpha: 0,
    });

    const animateFooterLogo = () => {
      // Reset the last path visibility before starting the animation
      gsap.set(lastPath, { autoAlpha: 0 });

      const tl = gsap.timeline();

      paths.forEach((path, index) => {
        const baseDelay = index * FOOTER_ANIMATION_CONFIG.STAGGER;
        const isLastPath = index === paths.length - 1;

        // Flash animation
        tl.to(
          path,
          {
            autoAlpha: 1,
            duration: 0.1,
            ease: "none",
          },
          baseDelay
        );

        // Only fade out if it's not the last path
        if (!isLastPath) {
          tl.to(
            path,
            {
              autoAlpha: 0,
              duration: 0.1,
              ease: "none",
            },
            baseDelay + FOOTER_ANIMATION_CONFIG.VISIBILITY_DURATION
          );
        }
      });

      return tl;
    };

    // Create the scroll trigger
    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => animateFooterLogo(),
      onEnterBack: () => animateFooterLogo(),
    });

    // console.log(event.detail);
  });
}

{
  /** -- Copy Button */
  const copybtn = () => {
    const copybtn = [...document.querySelectorAll("[data-module='copybtn']")];

    // Create a map to store data for each button
    const buttonDataMap = new Map();

    // Single event listener that checks which button's data to use
    document.addEventListener("copy", (event) => {
      const activeButtonData = buttonDataMap.get("active");
      if (activeButtonData) {
        event.preventDefault();
        event.clipboardData.setData(
          "application/json",
          JSON.stringify(activeButtonData)
        );
        event.clipboardData.setData(
          "text/plain",
          JSON.stringify(activeButtonData)
        );
        buttonDataMap.delete("active"); // Clear after copying
      }
    });

    copybtn.forEach((btn) => {
      const url = btn.getAttribute("data-copy");
      const text = btn.children[0].children[0];
      const icon = btn.querySelector("svg");
      let isAnimating = false;

      btn.onmouseenter = async () => {
        if (isAnimating) return;
        isAnimating = true;

        await gsap.to(icon, {
          rotate: "+=360",
          duration: 0.3,
          ease: "expo.out",
        });

        isAnimating = false;
      };

      btn.onclick = async (evt) => {
        try {
          const res = await fetch(url);
          let data = await res.text();

          // Try to parse as JSON in case it's JSON data
          try {
            const jsonData = JSON.parse(data);
            buttonDataMap.set("active", jsonData);
          } catch {
            buttonDataMap.set("active", data);
          }

          // Trigger the copy command
          document.execCommand("copy");

          text.textContent = "Copied!";
          console.log("copied successfully");

          setTimeout(() => {
            text.textContent = "Copy this";
          }, 1000);
        } catch (error) {
          console.error("Failed to copy:", error);
          text.textContent = "Failed to copy";

          setTimeout(() => {
            text.textContent = "Copy this";
          }, 1000);
        }
      };
    });
  };

  /** -- Split Text Button */
  const split = (text, type = "chars") => {
    text.setAttribute("aria-label", text.textContent);
    const splits = new SplitText(text, { type });
    splits[type].forEach((char) => char.setAttribute("aria-hidden", "true"));
    return splits[type];
  };

  const buttons = () => {
    const buttons = [...document.querySelectorAll("[data-module='btn']")];

    buttons.forEach((btn) => {
      const overflow = btn.children[0];
      const text = overflow.children[0];

      overflow.appendChild(text.cloneNode(true));
      const splitText1 = split(overflow.children[0], "chars");
      const splitText2 = split(overflow.children[1], "chars");

      const animation = {
        yPercent: "-=100",
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.02,
      };

      btn.onmouseenter = () => {
        gsap.to(splitText1, { ...animation, yPercent: -100 });
        gsap.to(splitText2, { ...animation, yPercent: -100 });
      };

      btn.onmouseleave = () => {
        gsap.to(splitText1, { ...animation, yPercent: 0 });
        gsap.to(splitText2, { ...animation, yPercent: 0 });
      };
    });
  };

  /** -- Controller */
  addEventListener("GSAPReady", (event) => {
    copybtn();

    // desktop only animations
    if (window.matchMedia("(min-width: 1024px)").matches) {
      buttons();
    }
  });
}
