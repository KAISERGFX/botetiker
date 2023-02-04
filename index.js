const { create, decryptMedia } = require("@open-wa/wa-automate");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;



app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

function start(client) {
  client.onAnyMessage(async (message) => {
    const { isMe, isMedia, caption, from, type, mimetype } = message;
    let stickerMetadata = {
      pack: "Stickers",
      author: "@xkaiserw",
      keepScale: true,
    };
    if (isMedia && caption?.toLowerCase() === "sticker") {
      if (mimetype) {
        const mediaData = await decryptMedia(message);
        const receiver = isMe ? to : from;
        if (type === "video") {
          await client.sendMp4AsSticker(receiver, mediaData, null, stickerMetadata);
        } else {
          await client.sendImageAsSticker(
            receiver,
            `data:${mimetype};base64,${mediaData.toString("base64")}`,
            stickerMetadata
          );
        }
      }
    }
  });
}

create().then(start);
