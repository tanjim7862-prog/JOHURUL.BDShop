var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
app.use(import_express.default.json());
var PORT = 3e3;
var apiKey = process.env.GEMINI_API_KEY;
var ai = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
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

Ensure the style is extremely professional, friendly, and culturally relevant to Bangladeshi online shoppers (e.g., mention "\u0986\u099C\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8", "\u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF", "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE").`;
  }
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      const text = response.text;
      return res.json({ success: true, text });
    } catch (error) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: "Failed to generate copy using Gemini. Here is a simulated fallback.",
        fallback: generateSimulatedCopy(productName, price, language, platform, style)
      });
    }
  } else {
    return res.json({
      success: true,
      text: generateSimulatedCopy(productName, price, language, platform, style),
      simulated: true
    });
  }
});
function generateSimulatedCopy(productName, price, language, platform = "facebook", style = "ugc_hook") {
  const finalPrice = price ? `${price}/- BDT` : "\u09B8\u09BE\u09B6\u09CD\u09B0\u09DF\u09C0 \u09AE\u09C2\u09B2\u09CD\u09AF";
  if (platform === "tiktok") {
    if (language === "bengali" || language === "both") {
      let styleTitle = "\u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1\u09BF\u0982 UGC (\u0987\u0989\u099C\u09BE\u09B0 \u099C\u09C7\u09A8\u09BE\u09B0\u09C7\u099F\u09C7\u09A1 \u0995\u09A8\u09CD\u099F\u09C7\u09A8\u09CD\u099F) \u09B9\u09C1\u0995";
      let hookVO = `"\u09AB\u09C7\u09B8\u09AC\u09C1\u0995 \u0986\u09B0 \u099F\u09BF\u0995\u099F\u0995\u09C7 \u098F\u0987 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BE \u098F\u09A4\u09AC\u09BE\u09B0 \u09A6\u09C7\u0996\u09C7\u099B\u09BF \u09AF\u09C7 \u09B6\u09C7\u09B7\u09AE\u09C7\u09B6 \u0995\u09BF\u09A8\u09C7\u0987 \u09AB\u09C7\u09B2\u09B2\u09BE\u09AE! \u0986\u09B0 \u09B8\u09A4\u09CD\u09AF\u09BF \u09AC\u09B2\u09A4\u09C7..."`;
      if (style === "problem_solution") {
        styleTitle = "\u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u0993 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8 \u09B8\u09CD\u099F\u09BE\u0987\u09B2 (Pain-point Solver)";
        hookVO = `"\u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09A6\u09BF\u09A8 \u098F\u0987 \u09A7\u09B0\u09A3\u09C7\u09B0 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE\u09DF \u09AA\u09DC\u09A4\u09C7 \u09B9\u09DF? \u09A4\u09BE\u09B9\u09B2\u09C7 \u098F\u0987 \u09AD\u09BF\u09A1\u09BF\u0993\u099F\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF\u0987!"`;
      } else if (style === "asmr_unboxing") {
        styleTitle = "ASMR \u0993 \u098F\u09B8\u09CD\u09A5\u09C7\u099F\u09BF\u0995 \u0986\u09A8\u09AC\u0995\u09CD\u09B8\u09BF\u0982";
        hookVO = `"*\u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F \u0996\u09CB\u09B2\u09BE\u09B0 \u09B8\u09C1\u09A8\u09CD\u09A6\u09B0 \u09AE\u09C3\u09A6\u09C1 \u09B6\u09AC\u09CD\u09A6* \u0986\u09B9! \u098F\u09AC\u09BE\u09B0 \u09A6\u09C7\u0996\u09C1\u09A8 \u0986\u09B8\u09B2 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u0995\u09BE\u0995\u09C7 \u09AC\u09B2\u09C7..."`;
      } else if (style === "direct_promo") {
        styleTitle = "\u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09A7\u09BE\u09AE\u09BE\u0995\u09BE \u0985\u09AB\u09BE\u09B0 \u09AA\u09CD\u09B0\u09CB\u09AE\u09CB";
        hookVO = `"\u09A5\u09BE\u09AE\u09C1\u09A8! \u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0996\u09A8\u0993 \u09AC\u09BE\u099C\u09BE\u09B0\u09C7 \u09B8\u09C7\u09B0\u09BE \u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 \u09B8\u09A0\u09BF\u0995 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BF \u0996\u09C1\u0981\u099C\u099B\u09C7\u09A8? \u0986\u099C\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8!"`;
      }
      return `\u{1F3AC} [\u09AD\u09BF\u09A1\u09BF\u0993 \u0986\u0987\u09A1\u09BF\u09DF\u09BE]: ${styleTitle} - "\u0986\u09AE\u09BE\u09B0 \u099C\u09C0\u09AC\u09A8 \u09AC\u09A6\u09B2\u09C7 \u09A6\u09C7\u0993\u09DF\u09BE \u098F\u0995\u099F\u09BF \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F!"

\u{1F552} \u09E6:\u09E6\u09E6 - \u09E6:\u09E6\u09E9 [\u09AD\u09BF\u09A1\u09BF\u0993 \u09A6\u09C3\u09B6\u09CD\u09AF]: \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BF \u0986\u09A8\u09AC\u0995\u09CD\u09B8 \u0995\u09B0\u09BE \u09B9\u099A\u09CD\u099B\u09C7, \u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1\u09C7 \u098F\u0995\u099F\u09BF \u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1\u09BF\u0982 \u0986\u09AA\u09AC\u09BF\u099F \u09AE\u09BF\u0989\u099C\u09BF\u0995 \u09AC\u09BE\u099C\u099B\u09C7\u0964
\u{1F399}\uFE0F [\u09AD\u09DF\u09C7\u09B8\u0993\u09AD\u09BE\u09B0]: ${hookVO}

\u{1F552} \u09E6:\u09E6\u09E9 - \u09E6:\u09E7\u09E8 [\u09AD\u09BF\u09A1\u09BF\u0993 \u09A6\u09C3\u09B6\u09CD\u09AF]: \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BF\u09B0 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09AB\u09BF\u09A8\u09BF\u09B6 \u0995\u09CD\u09B2\u09CB\u099C-\u0986\u09AA\u09C7 \u09A6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u099A\u09CD\u099B\u09C7 \u098F\u09AC\u0982 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u09B9\u09DF \u09A4\u09BE \u09A6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u099A\u09CD\u099B\u09C7\u0964
\u{1F399}\uFE0F [\u09AD\u09DF\u09C7\u09B8\u0993\u09AD\u09BE\u09B0]: "\u098F\u09B0 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u09B8\u09A4\u09CD\u09AF\u09BF\u0987 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3! \u098F\u099F\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09A6\u09BF\u09A8\u09C7\u09B0 \u0995\u09BE\u099C\u0995\u09C7 \u0995\u09B0\u09C7 \u09A4\u09C1\u09B2\u09AC\u09C7 \u0985\u09A8\u09C7\u0995 \u09B8\u09B9\u099C \u0986\u09B0 \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995\u0964"

\u{1F552} \u09E6:\u09E7\u09E8 - \u09E6:\u09E7\u09EB [\u09AD\u09BF\u09A1\u09BF\u0993 \u09A6\u09C3\u09B6\u09CD\u09AF]: \u09AB\u09CB\u09A8\u09C7\u09B0 \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09A8\u09C7 \u09B2\u09BE\u0987\u09AD \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u0993 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09AA\u09BE\u09B0\u09CD\u09B8\u09C7\u09B2 \u09AA\u09BE\u0993\u09DF\u09BE\u09B0 \u09A6\u09C3\u09B6\u09CD\u09AF\u0964
\u{1F399}\uFE0F [\u09AD\u09DF\u09C7\u09B8\u0993\u09AD\u09BE\u09B0]: "\u09B8\u09AC\u099A\u09C7\u09AF\u09BC\u09C7 \u09AD\u09BE\u09B2\u09CB \u09B2\u09C7\u0997\u09C7\u099B\u09C7 \u098F\u09A6\u09C7\u09B0 \u09B2\u09BE\u0987\u09AD \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u0986\u09B0 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE!"

\u{1F4AC} [\u0985\u09A8-\u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09A8 \u0995\u09CD\u09AF\u09BE\u09AA\u09B6\u09A8 \u09AC\u09BE \u09B8\u09BE\u09AC\u099F\u09BE\u0987\u099F\u09C7\u09B2]:
\u{1F449} \u09AE\u09BE\u09A4\u09CD\u09B0 ${finalPrice} \u099F\u09BE\u0995\u09BE\u09DF \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF!
\u{1F449} \u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF!
\u{1F449} \u0998\u09B0\u09C7 \u09AC\u09B8\u09C7\u0987 \u09B2\u09BE\u0987\u09AD \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE!

\u{1F4DD} [\u099F\u09BF\u0995\u099F\u0995 \u09AA\u09CB\u09B8\u09CD\u099F \u0995\u09CD\u09AF\u09BE\u09AA\u09B6\u09A8]:
TikTok made me buy it! \u{1F631} \u0985\u09AC\u09B6\u09C7\u09B7\u09C7 \u09AA\u09C7\u09DF\u09C7 \u0997\u09C7\u09B2\u09BE\u09AE \u0986\u09B8\u09B2 "${productName}"\u0964 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u099C\u09BE\u09B8\u09CD\u099F \u0993\u09DF\u09BE\u0993! \u098F\u0996\u09A8\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u09A8\u09BF\u099A\u09C7\u09B0 "Shop Now" \u09AC\u09BE\u099F\u09A8\u09C7 \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8! \u{1F447}\u2728
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
      return `\u{1F3AC} [Video Idea]: ${styleTitle} - "TikTok Made Me Buy It!"

\u{1F552} 0:00 - 0:03 [Visual]: Fast unboxing with a clean ASMR sound and upbeat trending background music.
\u{1F399}\uFE0F [Voiceover]: ${hookVO}

\u{1F552} 0:03 - 0:12 [Visual]: Close-up showing the premium textures and demonstrating how easily it works in real-time.
\u{1F399}\uFE0F [Voiceover]: "And honestly? It lives up to the hype! The quality is amazing and it literally saves so much time."

\u{1F552} 0:12 - 0:15 [Visual]: Showcasing the dynamic live courier tracking map on a mobile phone screen.
\u{1F399}\uFE0F [Voiceover]: "Plus, they have super fast cash on delivery and real-time live tracking!"

\u{1F4AC} [On-Screen Captions]:
\u{1F449} Premium quality for only ${finalPrice}!
\u{1F449} Fast Cash on Delivery Nationwide!
\u{1F449} Live Order Tracking Link!

\u{1F4DD} [TikTok Post Caption]:
Can't believe I waited this long to get the "${productName}"! \u{1F60D} Game changer and totally worth the hype. Get yours now with Cash on Delivery! \u{1F447}\u2728
#tiktokmademebuyit #trending #shopping #unboxing #ugc #foryoupage #viral`;
    }
  }
  if (language === "bengali" || language === "both") {
    return `\u{1F525} \u09B8\u09C0\u09AE\u09BF\u09A4 \u0985\u09AB\u09BE\u09B0! \u0986\u09AA\u09A8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A8\u09BF\u09DF\u09C7 \u098F\u09B2\u09BE\u09AE \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF\u09B0 "${productName}"!

\u{1F6D2} \u0986\u09AA\u09A8\u09BE\u09B0 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u099C\u09C0\u09AC\u09A8\u0995\u09C7 \u0986\u09B0\u0993 \u09B8\u09B9\u099C \u0993 \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995 \u0995\u09B0\u09A4\u09C7 \u098F\u0987 \u09AA\u09A3\u09CD\u09AF\u099F\u09BF \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0\u0964 \u09A8\u09BF\u0996\u09C1\u0981\u09A4 \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u098F\u09AC\u0982 \u09A6\u09C1\u09B0\u09CD\u09A6\u09BE\u09A8\u09CD\u09A4 \u09B8\u09CD\u09A5\u09BE\u09DF\u09BF\u09A4\u09CD\u09AC\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u098F\u099F\u09BF \u09A6\u09C7\u09AC\u09C7 \u09A6\u09C0\u09B0\u09CD\u0998\u09A6\u09BF\u09A8\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE\u09B0 \u09A8\u09BF\u09B6\u09CD\u099A\u09DF\u09A4\u09BE\u0964

\u0995\u09C7\u09A8 \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09A5\u09C7\u0995\u09C7 "${productName}" \u0995\u09BF\u09A8\u09AC\u09C7\u09A8?
\u2705 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u098F\u09AC\u0982 \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF \u09AB\u09BF\u09A8\u09BF\u09B6\u09BF\u0982
\u2705 \u09B8\u09C7\u09B0\u09BE \u0993 \u09B8\u09BE\u09B6\u09CD\u09B0\u09DF\u09C0 \u09A6\u09BE\u09AE - \u09AE\u09BE\u09A4\u09CD\u09B0 ${finalPrice}
\u2705 \u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF (Cash on Delivery)
\u2705 \u09B2\u09BE\u0987\u09AD \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE (\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F \u0995\u09CB\u09A5\u09BE\u09DF \u0986\u099B\u09C7 \u0998\u09B0\u09C7 \u09AC\u09B8\u09C7\u0987 \u09A6\u09C7\u0996\u09C1\u09A8!)

\u{1F381} \u09AC\u09BF\u09B6\u09C7\u09B7 \u099B\u09BE\u09DC \u09AA\u09C7\u09A4\u09C7 \u0986\u099C\u0987 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8!
\u{1F449} \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 "Shop Now" \u09AC\u09BE\u099F\u09A8\u09C7 \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8 \u0985\u09A5\u09AC\u09BE \u09AA\u09C7\u099C\u09C7 \u0987\u09A8\u09AC\u0995\u09CD\u09B8 \u0995\u09B0\u09C1\u09A8\u0964`;
  } else {
    return `\u{1F525} SPECIAL OFFER! Introducing the Premium "${productName}"!

\u{1F6D2} Designed to make your daily life easier and more comfortable, this product delivers exceptional performance. Built with high-quality materials, it guarantees durability and a modern look.

Why Choose Our "${productName}"?
\u2705 Premium quality with elegant finish
\u2705 Unbeatable price of only ${finalPrice}
\u2705 Super-fast Cash on Delivery all over Bangladesh
\u2705 Live Order Tracking (Track exactly where your parcel is!)

\u{1F381} Click "Shop Now" to place your order or message our page to secure yours today!`;
  }
}
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in Development mode.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
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
//# sourceMappingURL=server.cjs.map
