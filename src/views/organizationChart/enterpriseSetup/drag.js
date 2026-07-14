export const drag = function drag() {
  let isResizing = false;
  const left = document.querySelector(".left");
  const right = document.querySelector(".right");

  window.addEventListener("mousemove", function (e) {
    if (isResizing) {
      const containerWidth = document.querySelector(".container").clientWidth;
      const splitterWidth = splitter.clientWidth;
      const X = e.clientX;
      left.style.width = `${X}px`;
      right.style.width = `${containerWidth - X - splitterWidth}px`;
    }
  });

  window.addEventListener("mouseup", function () {
    isResizing = false;
  });
};
