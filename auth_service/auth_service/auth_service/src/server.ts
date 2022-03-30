import express from "express";

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
	return res.send("Hello world!");
});

app.listen(PORT, () => console.log("app listening on port 5000"));
