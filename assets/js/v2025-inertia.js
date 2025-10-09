{
  // CREDITS: https://codepen.io/GreenSock/pen/RwLepdQ?editors=1010

  addEventListener("GSAPReady", (event) => {
    // console.log("inertia");
    const wrapper = document.querySelector("[data-animate='inertia']");
    const items = [...wrapper.querySelector("[data-inertia='item']").children];

    /** --  Params */
    let dragDistancePerRotation = 3000;
    let itemWidth = items[0].offsetWidth; // Get width of the first item
    let itemCount = items.length;
    let radius = (itemWidth / (2 * Math.sin(Math.PI / itemCount))) * 0.85; // Dynamic radius
    const perspective = 5000; // Controls the strength of the perspective effect
    const proxy = document.createElement("div");
    const progressWrap = gsap.utils.wrap(0, 1);
    let startProgress = 0; // Define startProgress variable

    // Set up the perspective on the wrapper
    gsap.set(wrapper, {
      perspective: perspective,
      transformStyle: "preserve-3d",
    });

    // Set up the container for the rotating items
    const container = wrapper.querySelector("[data-inertia='item']");
    gsap.set(container, {
      transformStyle: "preserve-3d",
    });

    const spin = gsap.fromTo(
      items,
      {
        rotationY: (i) => (i * 360) / items.length,
        z: -radius, // Use dynamic radius
      },
      {
        rotationY: "-=360",
        duration: 20,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50% " + -radius + "px",
        z: -radius, // Maintain the z position throughout the animation
      }
    );

    // Set up the proxy element properly
    proxy.style.position = "absolute";
    proxy.style.width = "100%";
    proxy.style.height = "100%";
    proxy.style.top = "0";
    proxy.style.left = "0";
    proxy.style.zIndex = "1";
    proxy.style.cursor = "grab";
    wrapper.children[0].appendChild(proxy);

    // Create Draggable with mobile-friendly settings
    Draggable.create(proxy, {
      trigger: wrapper,
      type: "x",
      inertia: true,
      // allowNativeTouchScrolling: false, // Changed to false to prevent conflicts
      onPress() {
        gsap.killTweensOf(spin);
        spin.timeScale(0);
        startProgress = spin.progress();
      },
      onDrag: updateRotation,
      onThrowUpdate: updateRotation,
      onRelease() {
        if (!this.tween || !this.tween.isActive()) {
          gsap.to(spin, { timeScale: 1, duration: 1 });
        }
      },
      onThrowComplete() {
        gsap.to(spin, { timeScale: 1, duration: 1 });
      },
    });

    function updateRotation() {
      let p = startProgress + (this.startX - this.x) / dragDistancePerRotation;
      spin.progress(progressWrap(p));
    }

    function recalculatePositions() {
      itemWidth = items[0].offsetWidth;
      itemCount = items.length;
      radius = (itemWidth / (2 * Math.sin(Math.PI / itemCount))) * 0.8;

      // Update each item's rotationY and z
      items.forEach((item, i) => {
        gsap.set(item, {
          rotationY: (i * 360) / itemCount,
          z: -radius,
        });
      });

      // Update the spin tween's transformOrigin and z
      spin.vars.transformOrigin = "50% 50% " + -radius + "px";
      spin.vars.z = -radius;
      spin.invalidate(); // Re-initialize the tween with new values

      // Update the perspective if needed
      gsap.set(wrapper, {
        perspective: perspective,
      });
    }

    // Call on resize
    window.addEventListener("resize", recalculatePositions);

    // Add touch event listeners for better mobile support
    wrapper.addEventListener(
      "touchstart",
      (e) => {
        // Prevent default only if we're actually dragging
        if (e.target === wrapper || e.target === proxy) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  });

}
