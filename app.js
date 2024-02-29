document.addEventListener("DOMContentLoaded", () => {
    const generateButton = document.getElementById("generate");
    generateButton.addEventListener("click", generate);
    const locks = document.querySelectorAll(".lock");
    locks.forEach((lock, index) =>
      lock.addEventListener("click", (e) => handleLock(e, index))
    );
  });

  let inputPalette = ["-", "-", "-", "-", "-"];

  function generate() {
    let json_data = {
      adjacency: [
        1, 75, 33, 45, 31, 75, 1, 58, 51, 77, 33, 58, 1, 0, 0, 45, 51, 0, 1, 0,
        31, 77, 0, 0, 1,
      ],
      mode: "transformer",
      num_colors: 5,
      num_results: 1,
      palette: inputPalette,
    };

    fetch("https://api.huemint.com/color", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(json_data),
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        let palette = data.results[0].palette;
        let colorDivs = document.querySelectorAll(".color");
        colorDivs.forEach((div, index) => {
          div.parentElement.dataset.value = palette[index];
          div.style.backgroundColor = palette[index];
        });
      });
  }

  function handleLock(e, lockNumber) {
    let locked = e.currentTarget;
    if (locked.dataset.locked === "false") {
      inputPalette[lockNumber] = locked.parentElement.dataset.value;
      locked.dataset.locked = "true";
      copyToClipboard(locked.parentElement.dataset.value);
    } else if (locked.dataset.locked === "true") {
      inputPalette[lockNumber] = "-";
      locked.dataset.locked = "false";
    }
  }

  function generateHarmoniousPalette(baseColor) {
    const numberOfColors = 5;
    const baseHue = extractHue(baseColor);
    const colorPalette = [];
    for (let i = 0; i < numberOfColors; i++) {
      const hue = (baseHue + (360 / numberOfColors) * i) % 360;
      const color = `hsl(${hue},70%,50%)`;
      colorPalette.push(color);
    }
    return colorPalette;
  }

  function extractHue(color) {
    const hex = color.slice(1);
    const rgb = parseInt(hex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue;
    if (max === min) {
      hue = 0;
    } else {
      const d = max - min;
      switch (max) {
        case r:
          hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          break;
        case g:
          hue = ((b - r) / d + 2) * 60;
          break;
        case b:
          hue = ((r - g) / d + 4) * 60;
          break;
      }
    }
    return hue;
  }

  function copyToClipboard(text) {
    let input = document.createElement("input");
    input.type = "text";
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert("Color Copied: " + text);
  }