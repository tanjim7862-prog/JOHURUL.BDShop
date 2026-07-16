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
  const { productName, description, price, category, language = "bengali", platform = "facebook", style = "ugc_hook" } = req.body;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  let prompt = "";
  if (platform === "tiktok") {
    prompt = `You are an expert TikTok advertiser and viral video creator specializing in Bangladeshi e-commerce.
Create a highly engaging TikTok video script and ad caption for the following product:
- Name: ${productName}
- Category: ${category || "General"}
- Price: ${price ? price + " Taka" : "Varies"}
- Description: ${description || "High quality product"}
- TikTok Ad Style: ${style} (e.g., ugc_hook, problem_solution, asmr_unboxing, direct_promo)

Format the response exactly with these sections (using appropriate emojis):
1. [Video Concept] A description of the visual theme/idea of the TikTok video (e.g. trending UGC hook, unboxing, pain point).
2. [Video Script & Voiceover] A chronological script with timing markers (e.g. 0:00-0:03 [Visual Description] - Voiceover line, 0:03-0:12, 0:12-0:15) written in an engaging, natural tone (using ${language === "bengali" ? "Bangla/Bengali" : "English"}).
3. [On-Screen Captions] Dynamic, short text prompts to overlay on the TikTok video.
4. [TikTok Post Caption & Hashtags] A viral, punchy post caption under 150 characters with trending hashtags (e.g., #tiktokmademebuyit, #bangladesh, #viral).

Ensure the voiceover sounds like a real, enthusiastic customer or creator (UGC style) from Bangladesh.`;
  } else {
    prompt = `You are an expert social media advertiser specializing in Bangladeshi e-commerce and Facebook ad campaigns.
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
  }

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
        fallback: generateSimulatedCopy(productName, price, language, platform, style)
      });
    }
  } else {
    // If no API key is set, return a high-quality simulated copy so the user has an outstanding immediate experience
    return res.json({
      success: true,
      text: generateSimulatedCopy(productName, price, language, platform, style),
      simulated: true
    });
  }
});

// Helper to generate simulated copies
function generateSimulatedCopy(productName: string, price: string | number, language: string, platform: string = "facebook", style: string = "ugc_hook"): string {
  const finalPrice = price ? `${price}/- BDT` : "সাশ্রয়ী মূল্য";
  
  if (platform === "tiktok") {
    if (language === "bengali" || language === "both") {
      let styleTitle = "ট্রেন্ডিং UGC (ইউজার জেনারেটেড কন্টেন্ট) হুক";
      let hookVO = `"ফেসবুক আর টিকটকে এই প্রোডাক্টটা এতবার দেখেছি যে শেষমেশ কিনেই ফেললাম! আর সত্যি বলতে..."`;
      
      if (style === "problem_solution") {
        styleTitle = "সমস্যা ও সমাধান স্টাইল (Pain-point Solver)";
        hookVO = `"আপনার কি প্রতিদিন এই ধরণের সমস্যায় পড়তে হয়? তাহলে এই ভিডিওটি আপনার জন্যই!"`;
      } else if (style === "asmr_unboxing") {
        styleTitle = "ASMR ও এস্থেটিক আনবক্সিং";
        hookVO = `"*প্রোডাক্ট খোলার সুন্দর মৃদু শব্দ* আহ! এবার দেখুন আসল প্রিমিয়াম কোয়ালিটি কাকে বলে..."`;
      } else if (style === "direct_promo") {
        styleTitle = "সরাসরি ধামাকা অফার প্রোমো";
        hookVO = `"থামুন! আপনি কি এখনও বাজারে সেরা মূল্যে সঠিক প্রোডাক্টটি খুঁজছেন? আজই অর্ডার করুন!"`;
      }

      return `🎬 [ভিডিও আইডিয়া]: ${styleTitle} - "আমার জীবন বদলে দেওয়া একটি প্রোডাক্ট!"

🕒 ০:০০ - ০:০৩ [ভিডিও দৃশ্য]: প্রোডাক্টটি আনবক্স করা হচ্ছে, ব্যাকগ্রাউন্ডে একটি ট্রেন্ডিং আপবিট মিউজিক বাজছে।
🎙️ [ভয়েসওভার]: ${hookVO}

🕒 ০:০৩ - ০:১২ [ভিডিও দৃশ্য]: প্রোডাক্টটির প্রিমিয়াম ফিনিশ ক্লোজ-আপে দেখানো হচ্ছে এবং কীভাবে ব্যবহার করতে হয় তা দেখানো হচ্ছে।
🎙️ [ভয়েসওভার]: "এর কোয়ালিটি সত্যিই অসাধারণ! এটি আপনার প্রতিদিনের কাজকে করে তুলবে অনেক সহজ আর আরামদায়ক।"

🕒 ০:১২ - ০:১৫ [ভিডিও দৃশ্য]: ফোনের স্ক্রিনে লাইভ কুরিয়ার ট্র্যাকিং ও ক্যাশ অন ডেলিভারি পার্সেল পাওয়ার দৃশ্য।
🎙️ [ভয়েসওভার]: "সবচেয়ে ভালো লেগেছে এদের লাইভ অর্ডার ট্র্যাকিং আর ক্যাশ অন ডেলিভারি সুবিধা!"

💬 [অন-স্ক্রিন ক্যাপশন বা সাবটাইটেল]:
👉 মাত্র ${finalPrice} টাকায় প্রিমিয়াম কোয়ালিটি!
👉 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি!
👉 ঘরে বসেই লাইভ কুরিয়ার ট্র্যাকিং সুবিধা!

📝 [টিকটক পোস্ট ক্যাপশন]:
TikTok made me buy it! 😱 অবশেষে পেয়ে গেলাম আসল "${productName}"। কোয়ালিটি জাস্ট ওয়াও! এখনই অর্ডার করতে নিচের "Shop Now" বাটনে ক্লিক করুন! 👇✨
#tiktokmademebuyit #foryoupage #bangladesh #onlineshopping #premium #trending #viral`;
    } else {
      let styleTitle = "Trending UGC Hook";
      let hookVO = `"Okay, so I've been seeing this product all over my FYP, and I finally gave in and ordered it..."`;
      
      if (style === "problem_solution") {
        styleTitle = "Problem-Solution Style";
        hookVO = `"Are you tired of dealing with this annoying issue? Let me show you the ultimate life-saver!"`;
      } else if (style === "asmr_unboxing") {
        styleTitle = "Aesthetic ASMR Unboxing";
        hookVO = `"*Crisp unboxing sounds* Ah, the satisfying click of opening this premium parcel..."`;
      } else if (style === "direct_promo") {
        styleTitle = "Direct Crazy Offer Promo";
        hookVO = `"Stop scrolling! If you want the absolute best value with direct home delivery, listen closely!"`;
      }

      return `🎬 [Video Idea]: ${styleTitle} - "TikTok Made Me Buy It!"

🕒 0:00 - 0:03 [Visual]: Fast unboxing with a clean ASMR sound and upbeat trending background music.
🎙️ [Voiceover]: ${hookVO}

🕒 0:03 - 0:12 [Visual]: Close-up showing the premium textures and demonstrating how easily it works in real-time.
🎙️ [Voiceover]: "And honestly? It lives up to the hype! The quality is amazing and it literally saves so much time."

🕒 0:12 - 0:15 [Visual]: Showcasing the dynamic live courier tracking map on a mobile phone screen.
🎙️ [Voiceover]: "Plus, they have super fast cash on delivery and real-time live tracking!"

💬 [On-Screen Captions]:
👉 Premium quality for only ${finalPrice}!
👉 Fast Cash on Delivery Nationwide!
👉 Live Order Tracking Link!

📝 [TikTok Post Caption]:
Can't believe I waited this long to get the "${productName}"! 😍 Game changer and totally worth the hype. Get yours now with Cash on Delivery! 👇✨
#tiktokmademebuyit #trending #shopping #unboxing #ugc #foryoupage #viral`;
    }
  }

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
