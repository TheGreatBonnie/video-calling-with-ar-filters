const init = async () => {
  const meeting = await DyteClient.init({
    authToken: "",
    defaults: {
      audio: true,
      video: true,
    },
  });

  const btn = document.getElementById("arFilter");
  const controlBar = document.getElementById("controlbar");

  var count = 0;

  async function RetroTheme() {
    let lastProcessedImage = null;
    const intermediatoryCanvas = document.createElement("canvas");
    intermediatoryCanvas.width = 640;
    intermediatoryCanvas.height = 480;
    const intermediatoryCanvasCtx = intermediatoryCanvas.getContext("2d");

    const deepARCanvas = document.createElement("canvas");
    deepARCanvas.width = 680;
    deepARCanvas.height = 480;

    const Filter = ["./effects/lion"];

    const deepAR = await deepar.initialize({
      licenseKey: "",
      canvas: deepARCanvas,
      effect: Filter,
      additionalOptions: {
        cameraConfig: {
          disableDefaultCamera: true,
        },
      },
    });

    let filterIndex = 0;
    const filters = [
      "./effects/lion",
      "./effects/flowers",
      "./effects/dalmatian",
      "./effects/background_segmentation",
      "./effects/background_blur",
      "./effects/aviators",
    ];
    const changeFilterButton = document.getElementById("switchFilter");

    changeFilterButton.addEventListener("click", filterChangeHandler);

    async function filterChangeHandler() {
      filterIndex = (filterIndex + 1) % filters.length;
      await deepAR.switchEffect(filters[filterIndex]);
    }

    return async (canvas, ctx) => {
      intermediatoryCanvasCtx.drawImage(canvas, 0, 0);
      if (lastProcessedImage) {
        ctx.drawImage(
          lastProcessedImage,
          0,
          0,
          lastProcessedImage.width,
          lastProcessedImage.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      await deepAR.processImage(intermediatoryCanvas);
      const image = new Image();
      image.id = "pic";
      image.src = await deepAR.takeScreenshot();
      lastProcessedImage = image;
    };
  }

  btn.addEventListener("click", myFunction);

  function myFunction() {
    count++;

    if (count % 2 == 0) {
      meeting.self.removeVideoMiddleware(RetroTheme);
    } else {
      meeting.self.addVideoMiddleware(RetroTheme);
    }
  }

  meeting.self.on("roomJoined", () => {
    controlBar.style.display = "block";
  });

  document.getElementById("my-meeting").meeting = meeting;
};

init();
