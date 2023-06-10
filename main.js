const init = async () => {
  const meeting = await DyteClient.init({
    authToken:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImRkZjU3YzBmLTFkM2UtNDdmZS1iNmE1LWEwNmM3NDIwMTVhMCIsIm1lZXRpbmdJZCI6ImJiYmJmZTNlLWEyYjYtNGMzNy05ZTIzLWNmYzkzMWM1Y2E3OSIsInBhcnRpY2lwYW50SWQiOiJhYWFlNWY5Mi1mZmYwLTQ2MzItOTdiNy0xOWQ2ZDVmOTE1NTgiLCJwcmVzZXRJZCI6IjM4NzI3NWEwLTBmZTgtNDAyOC05ZDkwLTNhNWYxOTc1M2ZiZCIsImlhdCI6MTY4MDY0MzIwMSwiZXhwIjoxNjg5MjgzMjAxfQ.mmspLJ64kpmKnJGLKKQmQsYBV1r0PdjKRwwUM0UgirkODlqPp2hDb3Ip3MHf7Uy_OdUqeaxbBAwiUzHJZvJ54M2i9RrGqCdaWploG1BbKUiM_A0SHC7OjmO_rrU9M529gAaQla7o9HWP-EBFQfLybO_5Ml6Y9oAcj6P4p-CZtKHnUGynyeV8UKzrR0tIouIDNzoiaEXrkVEz4ryL9BhklZ4Y3CQ701PC-PREF_MrcXSNjep934aXGD-sZ706T5GaW9N21IrslFqSdq8rasJ4CJsClQsaPMpqf6uToV-V2H1EM9Q0hN_WinNc6P_1H3jq5WBBqxGwrruvwGGGqxvhrg",
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
      licenseKey:
        "65dbfab62ee7614ffe9a9bff3b2ffb06ede0bf8f90c6bea28f9a757ce0d17a8d0f83e81239a23b32",
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
