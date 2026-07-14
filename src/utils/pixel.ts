/**
 * Facebook & TikTok Pixel Integration Helper for order boosting and conversions.
 * Supports standard events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
 */

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    ttq?: any;
  }
}

// Keep track of initialized pixels to avoid duplicate loads
let isFbInitialized = false;
let isTtInitialized = false;

/**
 * Dynamically loads and initializes the Meta (Facebook) Pixel
 */
export const initFacebookPixel = (pixelId: string) => {
  if (!pixelId || typeof window === "undefined") return;
  
  try {
    // If already loaded/initialized, just update key
    if (window.fbq && isFbInitialized) {
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
      return;
    }

    /* eslint-disable */
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    if (window.fbq) {
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
      isFbInitialized = true;
      console.log(`[Pixel] Facebook Pixel (${pixelId}) successfully initialized.`);
    }
  } catch (error) {
    console.error("[Pixel] Error initializing Facebook Pixel:", error);
  }
};

/**
 * Dynamically loads and initializes the TikTok Pixel
 */
export const initTikTokPixel = (pixelId: string) => {
  if (!pixelId || typeof window === "undefined") return;

  try {
    if (window.ttq && isTtInitialized) {
      window.ttq.load(pixelId);
      window.ttq.page();
      return;
    }

    /* eslint-disable */
    (function (w: any, d: any, t: any) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "analytics", "version"];
      ttq.setAndDefer = function(t: any, e: any) {
        t[e] = function() {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.instance = function(t: any) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) {
          ttq.setAndDefer(e, ttq.methods[n]);
        }
        return e;
      };
      ttq._i = ttq._i || {};
      ttq._f = ttq._f || {};
      ttq._p = ttq._p || {};
      ttq._d = ttq._d || {};
      ttq._d[t] = 1;
      ttq._b = ttq._b || [];
      ttq._b.push(["init", t]);
      ttq.load = function(e: any, n: any) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date;
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        var o = d.createElement("script");
        o.type = "text/javascript";
        o.async = !0;
        o.src = r;
        var a = d.getElementsByTagName("script")[0];
        a.parentNode.insertBefore(o, a);
      };
    })(window, document, "ttq");
    /* eslint-enable */

    if (window.ttq) {
      window.ttq.load(pixelId);
      window.ttq.page();
      isTtInitialized = true;
      console.log(`[Pixel] TikTok Pixel (${pixelId}) successfully initialized.`);
    }
  } catch (error) {
    console.error("[Pixel] Error initializing TikTok Pixel:", error);
  }
};

/**
 * Track an action/event on both Meta (Facebook) and TikTok pixels.
 * Supports standard event parameters like value, currency, content_name, content_type.
 */
export const trackPixelEvent = (
  eventName: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase",
  params?: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
    contents?: Array<{ id: string; quantity: number; item_price?: number; name?: string }>;
  }
) => {
  if (typeof window === "undefined") return;

  const bdtValue = params?.value || 0;
  const currency = params?.currency || "BDT";

  // 1. Meta (Facebook) Pixel Event Mapping
  if (window.fbq) {
    try {
      if (eventName === "PageView") {
        window.fbq("track", "PageView");
      } else if (eventName === "ViewContent") {
        window.fbq("track", "ViewContent", {
          content_name: params?.content_name,
          content_category: params?.content_category,
          content_ids: params?.content_ids,
          content_type: "product",
          value: bdtValue,
          currency: currency
        });
      } else if (eventName === "AddToCart") {
        window.fbq("track", "AddToCart", {
          content_name: params?.content_name,
          content_ids: params?.content_ids,
          content_type: "product",
          value: bdtValue,
          currency: currency
        });
      } else if (eventName === "InitiateCheckout") {
        window.fbq("track", "InitiateCheckout", {
          content_ids: params?.content_ids,
          content_type: "product",
          value: bdtValue,
          currency: currency
        });
      } else if (eventName === "Purchase") {
        window.fbq("track", "Purchase", {
          content_ids: params?.content_ids,
          content_type: "product",
          value: bdtValue,
          currency: currency
        });
      }
      console.log(`[Pixel] Meta Event sent: ${eventName}`, params);
    } catch (err) {
      console.error("[Pixel] Error sending Meta Event:", err);
    }
  }

  // 2. TikTok Pixel Event Mapping
  if (window.ttq) {
    try {
      // Map event names to TikTok standards
      let tiktokEventName = eventName;
      
      const ttParams: any = {
        value: bdtValue,
        currency: currency,
      };

      if (params?.contents) {
        ttParams.contents = params.contents.map(c => ({
          content_id: c.id,
          content_name: c.name,
          content_type: "product",
          quantity: c.quantity,
          price: c.item_price
        }));
      }

      if (eventName === "PageView") {
        window.ttq.page();
      } else {
        window.ttq.track(tiktokEventName, ttParams);
      }
      console.log(`[Pixel] TikTok Event sent: ${tiktokEventName}`, ttParams);
    } catch (err) {
      console.error("[Pixel] Error sending TikTok Event:", err);
    }
  }
};
