const { create, decryptMedia } = require("@open-wa/wa-automate");

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3030;

// your code

app.listen(PORT, () => {

  console.log(`server started on port ${PORT}`);

});

app.get('/', (req, res) => {

  res.send('Hello World!')

})

function start(client) {

  client.onMessage(async (message) => {

    const { isMedia, caption, from, type, mimetype } =

      message;

    let stickerMetadata = {

      pack: "Dav",

      author: "@dav.snow",

      keepScale: true,

    };

    if (isMedia && caption?.toLowerCase() === "sticker") {

      if (mimetype) {

        const mediaData = await decryptMedia(message);

        if (type === "video") {

          await client.sendMp4AsSticker(from, mediaData, null, stickerMetadata);

        } else {

          await client.sendImageAsSticker(

            from,

            `data:${mimetype};base64,${mediaData.toString("base64")}`,

            stickerMetadata

          );

        }

      }

    }

  });

}

create().then(start)
