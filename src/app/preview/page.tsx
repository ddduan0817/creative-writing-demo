"use client";

import {
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  Check,
  Share2,
  Download,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

type DeviceType = "pc" | "tablet" | "mobile";

interface DeviceConfig {
  id: DeviceType;
  label: string;
  icon: typeof Monitor;
  width: number | null; // null means adaptive
  height: number | null;
}

const deviceConfigs: DeviceConfig[] = [
  { id: "pc", label: "电脑", icon: Monitor, width: null, height: null },
  { id: "tablet", label: "平板", icon: Tablet, width: 768, height: 1024 },
  { id: "mobile", label: "手机", icon: Smartphone, width: 390, height: 844 },
];

export default function PreviewPage() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("pc");
  const [previousDevice, setPreviousDevice] = useState<DeviceType>("pc");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingStartTimeRef = useRef<number>(0);

  // Toast helper
  const toast = useCallback((message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  // Loading simulation - show loading after 1s
  useEffect(() => {
    if (isLoading) {
      loadingStartTimeRef.current = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - loadingStartTimeRef.current;
        setLoadingTime(elapsed);

        // Timeout after 5s
        if (elapsed > 5000) {
          setIsLoading(false);
          setLoadingTime(0);
          setSelectedDevice(previousDevice);
          toast("预览加载较慢，请稍后重试");
          if (loadingTimerRef.current) {
            clearInterval(loadingTimerRef.current);
          }
        }
      }, 100);
      loadingTimerRef.current = timer;
      return () => {
        if (loadingTimerRef.current) {
          clearInterval(loadingTimerRef.current);
        }
      };
    } else {
      setLoadingTime(0);
    }
  }, [isLoading, previousDevice, toast]);

  // Handle device switch
  const handleDeviceSwitch = (device: DeviceType) => {
    if (device === selectedDevice) {
      setDropdownOpen(false);
      return;
    }

    setPreviousDevice(selectedDevice);
    setSelectedDevice(device);
    setDropdownOpen(false);
    setIsLoading(true);
    setError(null);

    // Simulate loading (in real app, this would be iframe reload)
    setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulated load time < 1s, so no loading UI shown
  };

  // Handle reset
  const handleReset = () => {
    toast("已重置预览");
  };

  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("链接已复制");
  };

  // Handle export
  const handleExport = () => {
    toast("正在导出...");
  };

  // Get current device config
  const currentConfig = deviceConfigs.find((d) => d.id === selectedDevice)!;
  const CurrentIcon = currentConfig.icon;

  // Calculate device frame dimensions
  const getDeviceFrameStyle = () => {
    if (selectedDevice === "pc") return null;

    const config = currentConfig;
    const maxWidth = 1200;
    const maxHeight = 800;
    const padding = 40;

    let scale = 1;
    if (config.width && config.height) {
      const scaleX = (maxWidth - padding * 2) / config.width;
      const scaleY = (maxHeight - padding * 2) / config.height;
      scale = Math.min(scaleX, scaleY, 1);
    }

    return {
      width: config.width ? config.width * scale : "100%",
      height: config.height ? config.height * scale : "100%",
      scale,
    };
  };

  const frameStyle = getDeviceFrameStyle();

  return (
    <div className="w-[1441px] h-[900px] overflow-hidden bg-[rgba(246,247,250,1)] flex flex-col">
      {/* Toolbar */}
      <div className="h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-2 flex-shrink-0">
        {/* Device Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <CurrentIcon className="w-4 h-4" />
            <span>{currentConfig.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-[120px]">
              {deviceConfigs.map((device) => {
                const Icon = device.icon;
                const isSelected = selectedDevice === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => handleDeviceSwitch(device.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition ${
                      isSelected
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {device.label}
                    </span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-2" />

        {/* Other Actions */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition"
        >
          <Share2 className="w-4 h-4" />
          分享
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg transition"
        >
          <Download className="w-4 h-4" />
          导出
        </button>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-6">
        {selectedDevice === "pc" ? (
          // PC Mode - Full width
          <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden relative">
            {/* Background Image */}
            <img
              src="./assets/preview/image_1.png"
              className="w-full h-full object-cover"
              alt="Preview content"
            />
            {/* Loading Overlay */}
            {isLoading && loadingTime > 1000 && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-500">加载中...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Tablet/Mobile Mode - Device Frame
          <div className="flex items-center justify-center">
            <div
              className="relative"
              style={{
                width: frameStyle?.width,
                height: frameStyle?.height,
              }}
            >
              {/* Device Frame */}
              {selectedDevice === "mobile" ? (
                // Mobile Frame
                <div
                  className="relative bg-gray-900 rounded-[40px] p-3"
                  style={{
                    width: frameStyle?.width ? Number(frameStyle.width) + 24 : "auto",
                    height: frameStyle?.height ? Number(frameStyle.height) + 24 : "auto",
                  }}
                >
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10" />
                  {/* Screen */}
                  <div
                    className="bg-white rounded-[32px] overflow-hidden relative"
                    style={{
                      width: frameStyle?.width,
                      height: frameStyle?.height,
                    }}
                  >
                    <img
                      src="./assets/preview/image_1.png"
                      className="w-full h-full object-cover"
                      alt="Preview content"
                    />
                    {/* Loading Overlay */}
                    {isLoading && loadingTime > 1000 && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                          <span className="text-xs text-gray-500">加载中...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
                </div>
              ) : (
                // Tablet Frame
                <div
                  className="relative bg-gray-800 rounded-[20px] p-2"
                  style={{
                    width: frameStyle?.width ? Number(frameStyle.width) + 16 : "auto",
                    height: frameStyle?.height ? Number(frameStyle.height) + 16 : "auto",
                  }}
                >
                  {/* Camera */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full z-10" />
                  {/* Screen */}
                  <div
                    className="bg-white rounded-[16px] overflow-hidden relative"
                    style={{
                      width: frameStyle?.width,
                      height: frameStyle?.height,
                    }}
                  >
                    <img
                      src="./assets/preview/image_1.png"
                      className="w-full h-full object-cover"
                      alt="Preview content"
                    />
                    {/* Loading Overlay */}
                    {isLoading && loadingTime > 1000 && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                          <span className="text-xs text-gray-500">加载中...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm">
            <div className="flex items-center gap-2 text-red-500 mb-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">加载失败</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
          {showToast}
        </div>
      )}
    </div>
  );
}
