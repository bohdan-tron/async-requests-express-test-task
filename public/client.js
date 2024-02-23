const startButton = document.getElementById("start");

startButton.addEventListener("click", async () => {
  const concurrency = parseInt(
    document.getElementById("concurrencyInput").value
  );
  const resultsElement = document.getElementById("results");
  const errorBlock = document.getElementById("errorMessage");
  const requests = [];
  const lastIndex = 1000;

  errorBlock.innerText = "";

  if (concurrency > 100) {
    errorBlock.innerText =
      "Number of concurrency should be lower or equal to 100";
    return;
  }

  if (concurrency < 1 || isNaN(concurrency)) {
    errorBlock.innerText = "Number of concurrency may be greater then 0";
    return;
  }

  startButton.disabled = true;

  for (let i = 1; i <= lastIndex; i++) {
    requests.push(sendRequest(i));

    if (requests.length >= concurrency) {
      await Promise.all(requests);
      requests.length = 0;
      await delay(1000);
    }

    if (i === lastIndex) {
      startButton.disabled = false;
    }
  }

  async function sendRequest(index) {
    try {
      const response = await fetch(`/api?index=${index}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const li = document.createElement("li");
      li.textContent = data.index;
      resultsElement.appendChild(li);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
