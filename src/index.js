var outputArea = $("#chat-output");

$("#user-input-form").on("submit", function (e) {
  e.preventDefault();

  var message = $("#user-input").val();

  outputArea.append(`
    <div class='bot-message'>
      <div class='message'>
        ${message}
      </div>
    </div>
  `);

  const https = require("https");
  const data = JSON.stringify({
    text: message,
    app: { id: "daf3a831-2437-45ca-95c3-928adfd2e6d9", name: "ABC Sales" },
  });
  const options = {
    hostname: "https://dummy.server.com",
    port: 443,
    path: "/api/v1/questions/actions/ask",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer <authorization_key>",
      "qlik-web-integration-id": "<ID>",
    },
  };

  const req = https.request(options, (res) => {
    res.setEncoding("utf8");
    res.on("data", (d) => {
      const myobj = JSON.parse(d);
      if ("narrative" in myobj.conversationalResponse.responses[0]) {
        const temp = myobj.conversationalResponse.responses[0].narrative.text;
        outputArea.append(`
      <div class='user-message'>
        <div class='message'>
          ${temp}
        </div>
      </div>
    `);
      } else if ("imageUrl" in myobj.conversationalResponse.responses[0]) {
        const img = myobj.conversationalResponse.responses[0].imageUrl;
        if ("narrative" in myobj.conversationalResponse.responses[1]) {
          const text_r =
            myobj.conversationalResponse.responses[1].narrative.text;
          outputArea.append(`
      <div class='user-message'>
      <div class ="message">
      ${text_r}
      <a href="https://dummy.server.com/${img}"><img src="https://dummy.server.com/${img}" width="300" height="200"></a>
      </div>
      </div>
    `);
        } else {
          outputArea.append(`
      <div class='user-message'>
        <div class='message'>
         <img src="https://dummy.server.com/${img}" width="300" height="200">
        </div>
      </div>
    `);
        }
      }
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();

  $("#user-input").val("");
});