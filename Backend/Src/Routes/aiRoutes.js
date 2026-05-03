const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../Controllers/AI/AiChat.Controller");

router.post("/chat", chatWithAI);

module.exports = router;
