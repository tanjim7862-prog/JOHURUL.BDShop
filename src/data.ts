import { Product, OrderStatus, TrackingStep } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Leather Wallet",
    banglaName: "প্রিমিয়াম চামড়ার ওয়ালেট",
    description: "Crafted from 100% genuine top-grain leather. Sleek design with RFID blocking technology, 6 card slots, and an easy-access ID window.",
    banglaDescription: "১০০% খাঁটি চামড়া দিয়ে তৈরি প্রিমিয়াম ওয়ালেট। এতে আছে আরএফআইডি ব্লকিং প্রযুক্তি, ৬টি কার্ড স্লট এবং একটি সহজে ব্যবহারের উপযোগী আইডি উইন্ডো।",
    price: 1250,
    originalPrice: 1850,
    image: "https://images.unsplash.com/photo-1627124718515-053ef11b7f03?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    rating: 4.8,
    reviewsCount: 142,
    stock: 25
  },
  {
    id: "2",
    name: "True Wireless Earbuds",
    banglaName: "ট্রু ওয়্যারলেস ইয়ারবাডস",
    description: "Active noise cancellation, ultra-low latency gaming mode, 30-hour combined battery life, and crystal clear call quality with quad mics.",
    banglaDescription: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন, গেমারদের জন্য আল্ট্রা-লো ল্যাটেন্সি মোড, চার্জিং কেসসহ ৩০ ঘণ্টা ব্যাটারি লাইফ এবং ৪টি এইচডি মাইক্রোফোন যুক্ত চমৎকার ইয়ারবাডস।",
    price: 2490,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
    category: "Electronics",
    rating: 4.6,
    reviewsCount: 89,
    stock: 18
  },
  {
    id: "3",
    name: "Minimalist Smart Watch",
    banglaName: "মিনিমালিস্ট স্মার্ট ওয়াচ",
    description: "AMOLED full-touch display, Spo2 blood oxygen monitoring, 24/7 heart-rate tracker, 12 sports modes, and up to 10 days of standby battery.",
    banglaDescription: "অ্যামোলেড ফুল-টাচ ডিসপ্লে, রক্তে অক্সিজেনের মাত্রা (Spo2) মনিটরিং, হার্ট-রেট ট্র্যাকার, ১২টি স্পোর্টস মোড এবং ১০ দিনের স্ট্যান্ডবাই ব্যাটারি লাইফ সমৃদ্ধ স্মার্ট ওয়াচ।",
    price: 3200,
    originalPrice: 4500,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600",
    category: "Electronics",
    rating: 4.7,
    reviewsCount: 210,
    stock: 12
  },
  {
    id: "4",
    name: "Premium Cotton Panjabi",
    banglaName: "প্রিমিয়াম কটন পাঞ্জাবি",
    description: "Breathable, high-quality organic cotton fabric with elegant embroidery on collar and placket. Perfect for festivals, Fridays, and special events.",
    banglaDescription: "শতভাগ আরামদায়ক অর্গানিক কটন দিয়ে তৈরি পাঞ্জাবি। কলার এবং বুকে সূক্ষ্ম ও মার্জিত এমব্রয়ডারি কাজ করা। উৎসব-পার্বণ ও জুম্মার নামাজের জন্য সেরা পছন্দ।",
    price: 1850,
    originalPrice: 2400,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600",
    category: "Apparel",
    rating: 4.9,
    reviewsCount: 312,
    stock: 30
  },
  {
    id: "5",
    name: "Organic Sylhet Tea Leaves",
    banglaName: "সিলেটের অর্গানিক চা পাতা",
    description: "Directly sourced from the lush tea gardens of Sreemangal, Sylhet. Premium black tea with an rich aroma and deep golden liquor.",
    banglaDescription: "শ্রীমঙ্গলের সবুজে ঘেরা চা বাগান থেকে সরাসরি সংগৃহীত প্রিমিয়াম ব্ল্যাক টি। চমৎকার সুবাস এবং আকর্ষণীয় লিকারে পাবেন এক সতেজ অনুভূতি।",
    price: 380,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600",
    category: "Grocery",
    rating: 4.5,
    reviewsCount: 76,
    stock: 50
  },
  {
    id: "6",
    name: "Waterproof Laptop Backpack",
    banglaName: "ওয়াটারপ্রুফ ল্যাপটপ ব্যাগ",
    description: "High-density water-resistant nylon, multi-compartment storage with dedicated 15.6-inch laptop sleeve, external USB charging port, and anti-theft back pocket.",
    banglaDescription: "উচ্চ ঘনত্বের ওয়াটারপ্রুফ নাইলন কাপড়, ল্যাপটপ রাখার জন্য ডেডিকেটেড সুরক্ষিত চেম্বার, মোবাইল চার্জ দেয়ার জন্য ইউএসবি পোর্ট এবং চোর-নিরোধক পকেট সমৃদ্ধ ব্যাগ।",
    price: 1650,
    originalPrice: 2200,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    rating: 4.7,
    reviewsCount: 95,
    stock: 22
  },
  {
    id: "7",
    name: "Comfort Breathable Sneakers",
    banglaName: "কমফোর্ট ব্রিদেল রানিং স্নিকার্স",
    description: "Premium casual sneakers with soft cushion support, non-slip rubber soles, and air-mesh fabric. Best choice for daily training, sports and casual styling.",
    banglaDescription: "সফট কুশন সাপোর্ট ও গ্রিপসহ প্রিমিয়াম রানিং স্নিকার্স। পা ঘেমে যাওয়া রোধ করতে ব্রিদেল এয়ার-মেশ ফেব্রিক ব্যবহার করা হয়েছে। হাঁটা, জগিং এবং স্টাইলিশ ক্যাজুয়াল ফ্যাশনের জন্য সেরা জুতো।",
    price: 1850,
    originalPrice: 2500,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    category: "Shoes & Footwear",
    rating: 4.9,
    reviewsCount: 156,
    stock: 14
  },
  {
    id: "8",
    name: "Natural Glow Face Serum",
    banglaName: "ন্যাচারাল গ্লো ফেস সিরাম",
    description: "Formulated with 10% Vitamin C and hyaluronic acid. Evens skin tone, reduces fine lines, and delivers healthy natural glowing skin within 2 weeks.",
    banglaDescription: "১০% ভিটামিন-সি এবং হায়ালুরোনিক অ্যাসিডের কার্যকারী ফর্মুলা। ত্বকের কালো দাগ দূর করে এবং ২ সপ্তাহের মধ্যে একটি স্বাস্থ্যকর উজ্জ্বল আভা ফুটিয়ে তোলে।",
    price: 950,
    originalPrice: 1400,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    category: "Cosmetics & Beauty",
    rating: 4.8,
    reviewsCount: 112,
    stock: 20
  }
];

export const BANGLADESH_DIVISIONS = [
  "Dhaka (ঢাকা)",
  "Chattogram (চট্টগ্রাম)",
  "Sylhet (সিলেট)",
  "Rajshahi (রাজশাহী)",
  "Khulna (খুলনা)",
  "Barishal (বরিশাল)",
  "Rangpur (রংপুর)",
  "Mymensingh (ময়মনসিংহ)"
];

export const DIVISION_TO_DISTRICTS: Record<string, string[]> = {
  "Dhaka (ঢাকা)": [
    "Dhaka (ঢাকা)",
    "Gazipur (গাজীপুর)",
    "Narayanganj (নারায়ণগঞ্জ)",
    "Tangail (টাঙ্গাইল)",
    "Narsingdi (নরসিংদী)",
    "Manikganj (মানিকগঞ্জ)",
    "Munshiganj (মুন্সীগঞ্জ)",
    "Faridpur (ফরিদপুর)"
  ],
  "Chattogram (চট্টগ্রাম)": [
    "Chattogram (চট্টগ্রাম)",
    "Cox's Bazar (কক্সবাজার)",
    "Feni (ফেনী)",
    "Cumilla (কুমিল্লা)",
    "Noakhali (নোয়াখালী)",
    "Chandpur (চাঁদপুর)",
    "Brahmanbaria (ব্রাহ্মণবাড়িয়া)",
    "Rangamati (রাঙ্গামাটি)"
  ],
  "Sylhet (সিলেট)": [
    "Sylhet (সিলেট)",
    "Moulvibazar (মৌলভীবাজার)",
    "Habiganj (হবিগঞ্জ)",
    "Sunamganj (সুনামগঞ্জ)"
  ],
  "Rajshahi (রাজশাহী)": [
    "Rajshahi (রাজশাহী)",
    "Bogura (বগুড়া)",
    "Pabna (পাবনা)",
    "Naogaon (নওগাঁ)",
    "Natore (নাটোর)",
    "Chapai Nawabganj (চাঁপাইনবাবগঞ্জ)"
  ],
  "Khulna (খুলনা)": [
    "Khulna (খুলনা)",
    "Jashore (যশোর)",
    "Bagerhat (বাগেরহাট)",
    "Kushtia (কুষ্টিয়া)",
    "Satkhira (সাতক্ষীরা)"
  ],
  "Barishal (বরিশাল)": [
    "Barishal (বরিশাল)",
    "Bhola (ভোলা)",
    "Patuakhali (পটুয়াখালী)",
    "Pirojpur (পিরোজপুর)",
    "Barguna (বরগুনা)"
  ],
  "Rangpur (রংপুর)": [
    "Rangpur (রংপুর)",
    "Dinajpur (দিনাজপুর)",
    "Kurigram (কুড়িগ্রাম)",
    "Gaibandha (গাইবান্ধা)",
    "Nilphamari (নীলফামারী)"
  ],
  "Mymensingh (ময়মনসিংহ)": [
    "Mymensingh (ময়মনসিংহ)",
    "Netrokona (নেত্রকোণা)",
    "Sherpur (শেরপুর)",
    "Jamalpur (জামালপুর)"
  ]
};

export const DISTRICT_TO_THANAS: Record<string, string[]> = {
  "Dhaka (ঢাকা)": [
    "Mirpur (মিরপুর)",
    "Uttara (উত্তরা)",
    "Gulshan (গুলশান)",
    "Dhanmondi (ধানমন্ডি)",
    "Savar (সাভার)",
    "Keraniganj (কেরানীগঞ্জ)",
    "Badda (বাড্ডা)",
    "Mohammadpur (মোহাম্মদপুর)",
    "Khilgaon (খিলগাঁও)",
    "Jatrabari (যাত্রাবাড়ী)",
    "Dhamrai (ধামরাই)"
  ],
  "Gazipur (গাজীপুর)": [
    "Gazipur Sadar (গাজীপুর সদর)",
    "Joydebpur (জয়দেবপুর)",
    "Kaliakair (কালিয়াকৈর)",
    "Sreepur (শ্রীপুর)",
    "Kapasia (কাপাসিয়া)",
    "Kaliganj (কালীগঞ্জ)"
  ],
  "Narayanganj (নারায়ণগঞ্জ)": [
    "Narayanganj Sadar (নারায়ণগঞ্জ সদর)",
    "Fatullah (ফতুল্লা)",
    "Siddhirganj (সিদ্ধিরগঞ্জ)",
    "Araihazar (আড়াইহাজার)",
    "Sonargaon (সোনারগাঁও)",
    "Rupganj (রূপগঞ্জ)"
  ],
  "Tangail (টাঙ্গাইল)": [
    "Tangail Sadar (টাঙ্গাইল সদর)",
    "Mirzapur (মির্জাপুর)",
    "Kalihati (কালিহাতী)",
    "Madhupur (মধুপুর)",
    "Gopalpur (গোপালপুর)",
    "Sakhipur (সখিপুর)"
  ],
  "Narsingdi (নরসিংদী)": [
    "Narsingdi Sadar (নরসিংদী সদর)",
    "Belabo (বেলাবো)",
    "Monohardi (মনোহরদী)",
    "Palash (পলাশ)",
    "Raipura (রায়পুরা)"
  ],
  "Manikganj (মানিকগঞ্জ)": [
    "Manikganj Sadar (মানিকগঞ্জ সদর)",
    "Singair (সিংগাইর)",
    "Saturia (সাটুরিয়া)",
    "Harirampur (হরিরামপুর)"
  ],
  "Munshiganj (মুন্সীগঞ্জ)": [
    "Munshiganj Sadar (মুন্সীগঞ্জ সদর)",
    "Srinagar (শ্রীনগর)",
    "Lohajang (লৌহজং)",
    "Gajaria (গজারিয়া)"
  ],
  "Faridpur (ফরিদপুর)": [
    "Faridpur Sadar (ফরিদপুর সদর)",
    "Bhanga (ভাঙ্গা)",
    "Boalmari (বোয়ালমারী)",
    "Madhukhali (মধুখালী)"
  ],
  "Chattogram (চট্টগ্রাম)": [
    "Double Mooring (ডবলমুরিং)",
    "Kotwali (কোতোয়ালী)",
    "Panchlaish (পাঁচলাইশ)",
    "Hathazari (হাটহাজারী)",
    "Patenga (পতেঙ্গা)",
    "Sitakunda (সীতাকুণ্ড)",
    "Anwara (আনোয়ারা)",
    "Patiya (পটিয়া)",
    "Mirsharai (মীরসরাই)",
    "Boalkhali (বোয়ালখালী)"
  ],
  "Cox's Bazar (কক্সবাজার)": [
    "Cox's Bazar Sadar (কক্সবাজার সদর)",
    "Chakaria (চকরিয়া)",
    "Maheshkhali (মহেশখালী)",
    "Ramis (রামু)",
    "Teknaf (টেকনাফ)",
    "Ukhia (উখিয়া)",
    "Pekua (পেকুয়া)"
  ],
  "Feni (ফেনী)": [
    "Feni Sadar (ফেনী সদর)",
    "Daganbhuiyan (দাগনভূঞা)",
    "Chhagalnaiya (ছাগলনাইয়া)",
    "Parshuram (পরশুরাম)",
    "Sonagazi (সোনাগাজী)",
    "Fulgazi (ফুলগাজী)"
  ],
  "Cumilla (কুমিল্লা)": [
    "Cumilla Sadar (কুমিল্লা সদর)",
    "Chaddagram (চৌদ্দগ্রাম)",
    "Laksam (লাকসাম)",
    "Debidwar (দেবিদ্বার)",
    "Burichang (বুড়িচং)",
    "Daudkandi (দাউদকান্দি)",
    "Chandina (চান্দিনা)"
  ],
  "Noakhali (নোয়াখালী)": [
    "Noakhali Sadar (নোয়াখালী সদর)",
    "Begumganj (বেগমগঞ্জ)",
    "Companiganj (কোম্পানীগঞ্জ)",
    "Hatiya (হাতিয়া)",
    "Senbagh (সেনবাগ)"
  ],
  "Chandpur (চাঁদপুর)": [
    "Chandpur Sadar (চাঁদপুর সদর)",
    "Hajiganj (হাজীগঞ্জ)",
    "Faridganj (ফরিদগঞ্জ)",
    "Matlab (মতলব)"
  ],
  "Brahmanbaria (ব্রাহ্মণবাড়িয়া)": [
    "Brahmanbaria Sadar (ব্রাহ্মণবাড়ীয়া সদর)",
    "Ashuganj (আশুগঞ্জ)",
    "Sarail (সরাইল)",
    "Nabinagar (নবীনগর)"
  ],
  "Rangamati (রাঙ্গামাটি)": [
    "Rangamati Sadar (রাঙ্গামাটি সদর)",
    "Kaptai (কাপ্তাই)",
    "Baghaichhari (বাঘাইছড়ি)"
  ],
  "Sylhet (সিলেট)": [
    "Sylhet Sadar (সিলেট সদর)",
    "Beanibazar (বিয়ানীবাজার)",
    "Golapganj (গোলাপগঞ্জ)",
    "Zakiganj (জকিগঞ্জ)",
    "Fenchuganj (ফেঞ্চুগঞ্জ)",
    "Kanaighat (কানাইঘাট)",
    "Balaganj (বালাগঞ্জ)"
  ],
  "Moulvibazar (মৌলভীবাজার)": [
    "Moulvibazar Sadar (মৌলভীবাজার সদর)",
    "Sreemangal (শ্রীমঙ্গল)",
    "Kulaura (কুলাউড়া)",
    "Rajnagar (রাজনগর)",
    "Barlekha (বড়লেখা)"
  ],
  "Habiganj (হবিগঞ্জ)": [
    "Habiganj Sadar (হবিগঞ্জ সদর)",
    "Nabiganj (নবীগঞ্জ)",
    "Madhabpur (মাধবপুর)",
    "Chunarughat (চুনারুঘাট)"
  ],
  "Sunamganj (সুনামগঞ্জ)": [
    "Sunamganj Sadar (সুনামগঞ্জ সদর)",
    "Chhatak (ছাতক)",
    "Jagannathpur (জগন্নাথপুর)",
    "Derai (দিরাই)"
  ],
  "Rajshahi (রাজশাহী)": [
    "Boalia (বোয়ালিয়া)",
    "Rajpara (রাজপাড়া)",
    "Motihar (মতিহার)",
    "Paba (পবা)",
    "Bagha (বাঘা)",
    "Godagari (গোদাগাড়ী)",
    "Puthia (পুঠিয়া)",
    "Tanore (তানোর)"
  ],
  "Bogura (বগুড়া)": [
    "Bogura Sadar (বগুড়া সদর)",
    "Sariakandi (সারিয়াকান্দি)",
    "Shajahanpur (শাজাহানপুর)",
    "Sherpur (শেরপুর)",
    "Shibganj (শিবগঞ্জ)",
    "Gabtali (গাবতলী)",
    "Kahaloo (কাহালু)"
  ],
  "Pabna (পাবনা)": [
    "Pabna Sadar (পাবনা সদর)",
    "Ishwardi (ঈশ্বরদী)",
    "Santhia (সাঁথিয়া)",
    "Bera (বেড়া)",
    "Sujanagar (সুজানগর)"
  ],
  "Naogaon (নওগাঁ)": [
    "Naogaon Sadar (নওগাঁ সদর)",
    "Mohadevpur (মহাদেবপুর)",
    "Patnitala (পত্নীতলা)",
    "Manda (মান্দা)"
  ],
  "Natore (নাটোর)": [
    "Natore Sadar (নাটোর সদর)",
    "Singra (সিংড়া)",
    "Bagatipara (বাগাতিপাড়া)",
    "Lalpur (লালপুর)"
  ],
  "Chapai Nawabganj (চাঁপাইনবাবগঞ্জ)": [
    "Chapai Nawabganj Sadar (চাঁপাইনবাবগঞ্জ সদর)",
    "Shibganj (শিবগঞ্জ)",
    "Nachole (নাচোল)"
  ],
  "Khulna (খুলনা)": [
    "Khulna Sadar (খুলনা সদর)",
    "Sonadanga (সোনাডাঙ্গা)",
    "Khalishpur (খালিশপুর)",
    "Daulatpur (দৌলতপুর)",
    "Rupsha (রূপসা)",
    "Dumuria (ডুমুরিয়া)",
    "Batiaghata (বটিয়াঘাটা)"
  ],
  "Jashore (যশোর)": [
    "Jashore Sadar (যশোর সদর)",
    "Abhaynagar (অভয়নগর)",
    "Bagherpara (বাঘেরপাড়া)",
    "Chougachha (চৌগাছা)",
    "Jhikargachha (ঝিকরগাছা)",
    "Keshabpur (কেশবপুর)",
    "Manirampur (মণিরামপুর)"
  ],
  "Bagerhat (বাগেরহাট)": [
    "Bagerhat Sadar (বাগেরহাট সদর)",
    "Mongla (মংলা)",
    "Morrelganj (মোড়েলগঞ্জ)",
    "Sarankhola (শরণখোলা)"
  ],
  "Kushtia (কুষ্টিয়া)": [
    "Kushtia Sadar (কুষ্টিয়া সদর)",
    "Kumarkhali (কুমারখালী)",
    "Bheramara (ভেড়ামারা)",
    "Mirpur (মিরপুর)"
  ],
  "Satkhira (সাতক্ষীরা)": [
    "Satkhira Sadar (সাতক্ষীরা সদর)",
    "Shyamnagar (শ্যামনগর)",
    "Assasuni (আশাশুনি)",
    "Kalaroa (কলারোয়া)"
  ],
  "Barishal (বরিশাল)": [
    "Kotwali (কোতোয়ালী)",
    "Airport (এয়ারপোর্ট)",
    "Bakerganj (বাকেরগঞ্জ)",
    "Babuganj (বাবুগঞ্জ)",
    "Wazirpur (উজিরপুর)",
    "Muladi (মুলাদী)",
    "Gournadi (গৌরনদী)"
  ],
  "Bhola (ভোলা)": [
    "Bhola Sadar (ভোলা সদর)",
    "Char Fasson (চরফ্যাশন)",
    "Lalmohan (লালমোহন)",
    "Tazumuddin (তজুমদ্দিন)",
    "Manpura (মনপুরা)"
  ],
  "Patuakhali (পটুয়াখালী)": [
    "Patuakhali Sadar (পটুয়াখালী সদর)",
    "Galachipa (গলাচিপা)",
    "Kalapara (কলাপাড়া)",
    "Bauphal (বাউফল)"
  ],
  "Pirojpur (পিরোজপুর)": [
    "Pirojpur Sadar (পিরোজপুর সদর)",
    "Mathbaria (মঠবাড়িয়া)",
    "Bhandaria (ভাণ্ডারিয়া)"
  ],
  "Barguna (বরগুনা)": [
    "Barguna Sadar (বরগুনা সদর)",
    "Amtali (আমতলী)",
    "Patharghata (পাথরঘাটা)"
  ],
  "Rangpur (রংপুর)": [
    "Rangpur Sadar (রংপুর সদর)",
    "Mithapukur (মিঠাপুকুর)",
    "Pirganj (পীরগঞ্জ)",
    "Badarganj (বদরগঞ্জ)",
    "Kaunia (কাউনিয়া)",
    "Gangachara (গঙ্গাচড়া)"
  ],
  "Dinajpur (দিনাজপুর)": [
    "Dinajpur Sadar (দিনাজপুর সদর)",
    "Birganj (বীরগঞ্জ)",
    "Parbatipur (পার্বতীপুর)",
    "Phulbari (ফুলবাড়ী)"
  ],
  "Kurigram (কুড়িগ্রাম)": [
    "Kurigram Sadar (কুড়িগ্রাম সদর)",
    "Ulipur (উলিপুর)",
    "Nageshwari (নাগেশ্বরী)",
    "Rajarhat (রাজারহাট)"
  ],
  "Gaibandha (গাইবান্ধা)": [
    "Gaibandha Sadar (গাইবান্ধা সদর)",
    "Gobindaganj (গোবিন্দগঞ্জ)",
    "Palashbari (পলাশবাড়ী)"
  ],
  "Nilphamari (নীলফামারী)": [
    "Nilphamari Sadar (নীলফামারী সদর)",
    "Saidpur (সৈয়দপুর)",
    "Domar (ডোমার)"
  ],
  "Mymensingh (ময়মনসিংহ)": [
    "Mymensingh Sadar (ময়মনসিংহ সদর)",
    "Trishal (ত্রিশাল)",
    "Bhaluka (ভালুকা)",
    "Gafargaon (গফরগাঁও)",
    "Muktagachha (মুক্তাগাছা)",
    "Ishwarganj (ঈশ্বরগঞ্জ)",
    "Phulpur (ফুলপুর)",
    "Haluaghat (হালুয়াঘাট)"
  ],
  "Netrokona (নেত্রকোণা)": [
    "Netrokona Sadar (নেত্রকোণা সদর)",
    "Mohanganj (মোহনগঞ্জ)",
    "Kendua (কেন্দুয়া)",
    "Kalmakanda (কলমাকান্দা)"
  ],
  "Sherpur (শেরপুর)": [
    "Sherpur Sadar (শেরপুর সদর)",
    "Nalitabari (নালিতাবাড়ী)",
    "Sreebardi (শ্রীবরদী)",
    "Nakla (নকলা)"
  ],
  "Jamalpur (জামালপুর)": [
    "Jamalpur Sadar (জামালপুর সদর)",
    "Sarishabari (সরিষাবাড়ী)",
    "Melandaha (মেলান্দহ)",
    "Dewanganj (দেওয়ানগঞ্জ)"
  ]
};

export function createDefaultTrackingHistory(createdAt: Date = new Date()): TrackingStep[] {
  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return [
    {
      status: OrderStatus.RECEIVED,
      title: "Order Placed Successfully",
      banglaTitle: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে",
      description: "Your order has been received and is waiting for confirmation.",
      banglaDescription: "আপনার অর্ডারটি আমাদের সিস্টেমে সফলভাবে যুক্ত হয়েছে এবং নিশ্চিতকরণের জন্য অপেক্ষমান রয়েছে।",
      timestamp: formatTime(createdAt),
      completed: true,
    },
    {
      status: OrderStatus.PROCESSING,
      title: "Processing Order",
      banglaTitle: "অর্ডার প্রসেসিং চলছে",
      description: "Our quality assurance team is preparing your package.",
      banglaDescription: "আমাদের কোয়ালিটি টিম আপনার প্রোডাক্টটি পরীক্ষা করছে এবং প্যাকেজিং শুরু করেছে।",
      timestamp: "--",
      completed: false,
    },
    {
      status: OrderStatus.SHIPPED,
      title: "Handed over to Delivery Partner",
      banglaTitle: "ডেলিভারি পার্টনারের কাছে হস্তান্তরিত",
      description: "Parcel dispatched and handed over to courier service.",
      banglaDescription: "আপনার পার্সেলটি সফলভাবে প্যাকেজিং শেষে কুরিয়ার সার্ভিসের কাছে হস্তান্তর করা হয়েছে।",
      timestamp: "--",
      completed: false,
    },
    {
      status: OrderStatus.OUT_FOR_DELIVERY,
      title: "Out for Delivery",
      banglaTitle: "ডেলিভারি দিতে বের হয়েছে",
      description: "Delivery hero is near your location. Keep your phone active.",
      banglaDescription: "আমাদের ডেলিভারি ম্যান আপনার এলাকায় প্রবেশ করেছে। অনুগ্রহ করে আপনার মোবাইল সচল রাখুন।",
      timestamp: "--",
      completed: false,
    },
    {
      status: OrderStatus.DELIVERED,
      title: "Package Delivered",
      banglaTitle: "পার্সেল ডেলিভারি সম্পন্ন",
      description: "Thank you for shopping with us! Cash collected.",
      banglaDescription: "আমাদের সাথে শপিং করার জন্য ধন্যবাদ! পার্সেলটি সফলভাবে আপনার কাছে পৌঁছানো হয়েছে।",
      timestamp: "--",
      completed: false,
    },
  ];
}

export function updateTrackingHistory(
  history: TrackingStep[],
  newStatus: OrderStatus,
  updateTime: Date = new Date()
): TrackingStep[] {
  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const statusOrder = [
    OrderStatus.RECEIVED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED
  ];

  const targetIndex = statusOrder.indexOf(newStatus);

  return history.map((step) => {
    const stepIndex = statusOrder.indexOf(step.status);
    
    if (stepIndex <= targetIndex && stepIndex !== -1) {
      return {
        ...step,
        completed: true,
        timestamp: step.timestamp === "--" ? formatTime(updateTime) : step.timestamp
      };
    } else {
      return {
        ...step,
        completed: false,
        timestamp: "--"
      };
    }
  });
}
