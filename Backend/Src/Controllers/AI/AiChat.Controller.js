const axios = require("axios");
const Product = require("../../Models/Products/Products");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in .env file");
      return res.status(500).json({ message: "AI Configuration error" });
    }

    // 1. Fetch relevant data from DB (Products)
    const products = await Product.findAll();
    const productsContext = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category_name,
      price_day: p.price_per_day,
      location: p.location,
      description: p.description,
    }));

    // 2. Static Site Info
    const faqContext = [
      {
        q: "How do I create a rental request?",
        a: "Select the dates on the product page and click 'Rent Now'.",
      },
      {
        q: "Is there a security deposit?",
        a: "Some sellers require a deposit, which is shown on the product page.",
      },
      {
        q: "What happens if an item is damaged?",
        a: "Report it immediately in the chat. Rently protection helps mediate.",
      },
      { q: "How do I list products?", a: "Go to Profile -> Add Product." },
      { q: "Support Email", a: "Rentlyprojectt@gmail.com" },
      { q: "Support Phone", a: "+01023587689" },
    ];

    // 3. Construct System Prompt
    const systemPrompt = `
You are a smart assistant for Rently, a rental website in Egypt.
Your job is to answer ONLY based on the provided website data.

STRICT RULES:
- Do NOT use any external knowledge.
- Do NOT guess or make up answers.
- If the answer is not in the data, reply with: "Sorry, I only answer questions related to our website."
- Answer in the same language as the user (Arabic or English).
- Be polite and helpful.

WEBSITE DATA:
Products: ${JSON.stringify(productsContext)}
FAQ: ${JSON.stringify(faqContext)}

BEHAVIOR:
1) If the question is about PRODUCTS:
   - Search the products list.
   - Return relevant products.
   - Format: [Product Name](/product/{id}) - [Price] EGP/day - [Location].
2) If the question is about FAQ or Contact:
   - Return the exact answer or info.
3) If no results found:
   - Say: "No matching products found."
    `;

    // 4. Direct API Call using Axios (Bypassing SDK fetch issues)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nUser Question: ${message}\nAnswer:`,
            },
          ],
        },
      ],
    });

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0].content
    ) {
      const text = response.data.candidates[0].content.parts[0].text;
      res.json({ reply: text });
    } else {
      throw new Error("Invalid response from Gemini API");
    }
  } catch (error) {
    console.error(
      "AI Chat Error Detail:",
      error.response?.data || error.message,
    );
    res.status(500).json({
      message: "Error communicating with AI. Please check your connection.",
    });
  }
};

module.exports = { chatWithAI };
