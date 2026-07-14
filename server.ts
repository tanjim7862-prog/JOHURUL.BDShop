import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google Gen AI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
} else {
  console.log("GEMINI_API_KEY not found or is placeholder. Using fallback simulation for ad copy.");
}

// API Routes
app.post("/api/marketing/ad-copy", async (req, res) => {
  const { productName, description, price, category, language = "bengali" } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  const prompt = `You are an expert social media advertiser specializing in Bangladeshi e-commerce and Facebook ad campaigns.
Create a highly engaging, high-conversion Facebook post / ad copy for the following product:
- Name: ${productName}
- Category: ${category || "General"}
- Price: ${price ? price + " Taka" : "Varies"}
- Description: ${description || "High quality product"}

Format the response exactly with these sections (using appropriate emoji accents):
1. [Hook] A killer opening line in ${language === "bengali" ? "Bangla (Bengali)" : "English"} to stop user scrolling.
2. [Description] 2-3 sentences explaining what makes this product amazing.
3. [Key Features] A bulleted list of 3-4 key benefits/features.
4. [Call To Action] A strong call to action directing them to buy with Cash on Delivery and Order Tracking available. Include placeholders like [Link Here] or [Order Now].

Ensure the style is extremely professional, friendly, and culturally relevant to Bangladeshi online shoppers (e.g., mention "আজই অর্ডার করুন", "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি", "অর্ডার ট্র্যাকিং সুবিধা").`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const text = response.text;
      return res.json({ success: true, text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      return res.status(500).json({ 
        error: "Failed to generate copy using Gemini. Here is a simulated fallback.",
        fallback: generateSimulatedCopy(productName, price, language)
      });
    }
  } else {
    // If no API key is set, return a high-quality simulated copy so the user has an outstanding immediate experience
    return res.json({
      success: true,
      text: generateSimulatedCopy(productName, price, language),
      simulated: true
    });
  }
});

// Helper to generate simulated copies
function generateSimulatedCopy(productName: string, price: string | number, language: string): string {
  const finalPrice = price ? `${price}/- BDT` : "সাশ্রয়ী মূল্য";
  if (language === "bengali" || language === "both") {
    return `🔥 সীমিত অফার! আপনার জন্য নিয়ে এলাম প্রিমিয়াম কোয়ালিটির "${productName}"!

🛒 আপনার দৈনন্দিন জীবনকে আরও সহজ ও আরামদায়ক করতে এই পণ্যটি অত্যন্ত কার্যকর। নিখুঁত ডিজাইন এবং দুর্দান্ত স্থায়িত্বের সাথে এটি দেবে দীর্ঘদিনের ব্যবহারযোগ্যতার নিশ্চয়তা।

কেন আমাদের থেকে "${productName}" কিনবেন?
✅ প্রিমিয়াম কোয়ালিটি এবং আকর্ষণীয় ফিনিশিং
✅ সেরা ও সাশ্রয়ী দাম - মাত্র ${finalPrice}
✅ সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি (Cash on Delivery)
✅ লাইভ অর্ডার ট্র্যাকিং সুবিধা (আপনার প্রোডাক্ট কোথায় আছে ঘরে বসেই দেখুন!)

🎁 বিশেষ ছাড় পেতে আজই সরাসরি অর্ডার করুন!
👉 অর্ডার করতে "Shop Now" বাটনে ক্লিক করুন অথবা পেজে ইনবক্স করুন।`;
  } else {
    return `🔥 SPECIAL OFFER! Introducing the Premium "${productName}"!

🛒 Designed to make your daily life easier and more comfortable, this product delivers exceptional performance. Built with high-quality materials, it guarantees durability and a modern look.

Why Choose Our "${productName}"?
✅ Premium quality with elegant finish
✅ Unbeatable price of only ${finalPrice}
✅ Super-fast Cash on Delivery all over Bangladesh
✅ Live Order Tracking (Track exactly where your parcel is!)

🎁 Click "Shop Now" to place your order or message our page to secure yours today!`;
  }
}

// Vite middleware configuration for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in Development mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving production static build.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
