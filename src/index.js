const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./routes/index");
const Products = require("./models/productController");
const Chapters = require("./models/chapterController");

dotenv.config();
app.use(express.json());
const url = "https://sttruyen.xyz";

app.use(
    cors({
        credentials: true,
        origin: "https://sttruyenhay.000webhostapp.com/",
    })
);

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    socket.on("readingComic", async (item) => {
        console.log(item);
        const product = await Products.findOne({ slug: item.slug });
        if (product) {
            product.watching = product.watching + 1;
            await Products.findOneAndUpdate(
                { slug: item.slug },
                {
                    watching: product.watching,
                }
            );
            const numberChapter = item.chapter.split("_")[1] * 1;
            const chapterId = product.chapter[numberChapter - 1]._id;
            const chapter = await Chapters.findById(chapterId);
            chapter.watching = chapter.watching + 1;
            await Chapters.findByIdAndUpdate(chapterId, {
                watching: chapter.watching,
            });
        }
    });
    socket.on("likes", async (item) => {
        const product = await Products.findOne({ slug: item.slug });
        if (item.status) {
            product.like = product.like + 1;
        } else {
            product.like = product.like - 1;
        }
        await Products.findOneAndUpdate(
            { slug: item.slug },
            {
                like: product.like,
            }
        );
    });

    socket.on("Rating", async (item) => {
        const product = await Products.findOne({ slug: item.slug });
        if (product) {
            if (!item.status) {
                product.reviewer += 1;
                product.rating = product.rating + item.star;
            } else {
                product.rating = product.rating - item.oldStar + item.star;
            }
            await Products.findOneAndUpdate(
                { slug: item.slug },
                {
                    rating: product.rating,
                    reviewer: product.reviewer,
                }
            );
        }
    });
});

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
    })
    .then((res) => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log(`your error :${err}`);
    });

const PORT = process.env.PORT || 5000;

router(app);

http.listen(PORT, () => {
    console.log("connected to port 5000");
});
