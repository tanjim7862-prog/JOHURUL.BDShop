import React from "react";
import { Order, OrderStatus } from "../types";
import { CheckCircle2, Circle, Clock, MapPin, Truck } from "lucide-react";

interface TrackingTimelineProps {
  order: Order;
  lang: "bn" | "en";
}

export default function TrackingTimeline({ order, lang }: TrackingTimelineProps) {
  // Determine current active step index
  const statusOrder = [
    OrderStatus.RECEIVED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED
  ];

  const currentStepIndex = statusOrder.indexOf(order.status);

  // Compute percentage progress for progress bar
  const progressPercent = currentStepIndex >= 0
    ? (currentStepIndex / (statusOrder.length - 1)) * 100
    : 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 gap-4">
        <div>
          <span className="text-xs font-semibold text-[#e11b22] bg-red-50 px-3 py-1 rounded-full uppercase">
            {lang === "bn" ? "লাইভ ট্র্যাকিং" : "Live Tracking"}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-2">
            {lang === "bn" ? "ট্র্যাকিং আইডি:" : "Tracking ID:"}{" "}
            <span className="font-mono text-[#e11b22] font-extrabold">{order.id}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {lang === "bn" ? "অর্ডারের তারিখ:" : "Ordered on:"} {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-xs text-gray-400">{lang === "bn" ? "বর্তমান অবস্থা" : "Current Status"}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-base font-bold text-gray-800">
              {lang === "bn"
                ? order.trackingHistory.find((t) => t.status === order.status)?.banglaTitle || order.status
                : order.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lang === "bn" ? "পেমেন্ট মাধ্যম: ক্যাশ অন ডেলিভারি" : "Payment: Cash on Delivery (COD)"}
          </p>
        </div>
      </div>

      {/* Interactive Delivery Animation Progress Line */}
      <div className="my-10 relative px-4">
        {/* Gray Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -translate-y-1/2 rounded-full"></div>
        {/* Green Active Line */}
        <div
          className="absolute top-1/2 left-0 h-1.5 bg-red-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>

        {/* Animated Bike Icon */}
        {order.status !== OrderStatus.CANCELLED && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -ml-5 transition-all duration-1000 ease-out z-10"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-[#e11b22] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Timeline Nodes */}
        <div className="relative flex justify-between">
          {order.trackingHistory.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div key={idx} className="flex flex-col items-center flex-1">
                {/* Node Dot */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                    isCompleted
                      ? isActive
                        ? "bg-[#e11b22] text-white ring-4 ring-emerald-100"
                        : "bg-red-500 text-white"
                      : "bg-white text-gray-300 border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                  ) : (
                    <Circle className="w-3 h-3 fill-current text-gray-200" />
                  )}
                </div>
                {/* Text labels under node */}
                <span
                  className={`mt-3 text-[10px] font-bold text-center tracking-tight leading-none block max-w-[80px] ${
                    isCompleted ? "text-[#e11b22]" : "text-gray-400"
                  }`}
                >
                  {lang === "bn" ? step.banglaTitle : step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographical Transit Simulation & Map Graphic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100">
        {/* Detailed List of steps */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#e11b22]" />
            {lang === "bn" ? "অর্ডারের টাইমলাইন" : "Order History"}
          </h4>

          <div className="space-y-4 relative border-l border-gray-100 pl-4 ml-2">
            {order.trackingHistory.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              return (
                <div key={idx} className="relative">
                  {/* Left Bullet Indicator */}
                  <div
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                      isCompleted ? "bg-red-500 border-white" : "bg-gray-100 border-white"
                    }`}
                  ></div>
                  <div>
                    <h5 className={`text-xs font-bold ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                      {lang === "bn" ? step.banglaTitle : step.title}
                    </h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {lang === "bn" ? step.banglaDescription : step.description}
                    </p>
                    <span className="text-[10px] font-mono text-[#e11b22] font-semibold block mt-0.5">
                      {step.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CSS Route Map Graphic */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-between overflow-hidden relative min-h-[220px]">
          <div>
            <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#e11b22]" />
              {lang === "bn" ? "ডেলিভারি রুট ট্র্যাকিং" : "Delivery Route Tracking"}
            </h4>
            <p className="text-[10px] text-gray-400 mt-1">
              {lang === "bn" ? "ঢাকা সেন্ট্রাল হাব থেকে আপনার জেলায় পাঠানো হচ্ছে।" : "Transit path from Dhaka Hub to destination district."}
            </p>
          </div>

          {/* Interactive SVG Routing */}
          <div className="relative h-28 my-2 flex items-center justify-center">
            {/* Simple Map Vector */}
            <svg viewBox="0 0 200 100" className="w-full h-full text-gray-300 opacity-60">
              {/* Central Hub */}
              <circle cx="50" cy="50" r="4" fill="#10b981" />
              <text x="50" y="42" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#ad1116">Dhaka Hub</text>

              {/* Transit Path Line */}
              <path
                d="M 50 50 Q 100 20 150 50"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M 50 50 Q 100 20 150 50"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-[dash_2s_linear_infinite]"
                style={{ strokeDashoffset: isCompleted(currentStepIndex, 2) ? 0 : 20 }}
              />

              {/* Destination Point */}
              <circle cx="150" cy="50" r="4" fill={currentStepIndex >= 3 ? "#10b981" : "#9ca3af"} />
              <text x="150" y="42" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#374151">
                {order.customerDistrict.split(" ")[0]}
              </text>

              {/* Courier Bike Icon Moving along line */}
              {currentStepIndex > 0 && currentStepIndex < 4 && (
                <g className="animate-[bounce_1s_infinite]">
                  <circle cx={50 + currentStepIndex * 25} cy={35} r="5" fill="#c9141b" />
                  <text x={50 + currentStepIndex * 25} y={38} fontSize="8" textAnchor="middle" fill="#ffffff">🛵</text>
                </g>
              )}
            </svg>
          </div>

          <div className="bg-red-50 rounded-xl p-3 border border-red-100 flex items-center justify-between text-xs">
            <span className="font-medium text-red-800">
              {lang === "bn" ? "ডেলিভারি ঠিকানা:" : "Delivery Address:"}
            </span>
            <span className="text-gray-600 font-semibold truncate max-w-[150px]" title={order.customerAddress}>
              {order.customerAddress}, {order.customerThana ? `${order.customerThana}, ` : ""}{order.customerDistrict}{order.customerDivision ? `, ${order.customerDivision}` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function isCompleted(currentIdx: number, thresholdIdx: number): boolean {
  return currentIdx >= thresholdIdx;
}
