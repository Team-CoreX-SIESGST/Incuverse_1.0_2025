import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Upload, Play, Square, Sparkles, Bot, User } from "lucide-react";

export default function ConsultationTab({
  isRecording,
  setIsRecording,
  audioBlob,
  setAudioBlob,
  selectedImage,
  setSelectedImage,
  consultationResult,
  isLoading,
  onConsult,
  onPlayAudio,
}) {
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/mp3" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          setIsRecording(false);
          stream.getTracks().forEach((track) => track.stop());
        }
      }, 30000);

      window.currentRecorder = { mediaRecorder, stream };
    } catch (error) {
      console.error("Recording failed:", error);
      alert("Microphone access denied. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    const recorder = window.currentRecorder;
    if (recorder) {
      recorder.mediaRecorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
      <TabHeader
        icon={Mic}
        title="AI Health Consultation"
        description="Get medical insights using voice and images"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <VoiceInput
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          audioBlob={audioBlob}
        />
        <ImageInput
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
        />
      </div>

      <ConsultationButton
        isLoading={isLoading}
        hasInput={audioBlob || selectedImage}
        onConsult={onConsult}
      />

      <ConsultationResults
        consultationResult={consultationResult}
        onPlayAudio={onPlayAudio}
      />
    </div>
  );
}

function TabHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-md mr-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function VoiceInput({
  isRecording,
  onStartRecording,
  onStopRecording,
  audioBlob,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
        <Mic className="w-5 h-5 mr-2 text-emerald-500" />
        Voice Description
      </h3>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Recording</span>
            </>
          )}
        </button>
        {audioBlob && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Audio recorded ({Math.round(audioBlob.size / 1024)} KB)
          </div>
        )}
      </div>
    </div>
  );
}

function ImageInput({ selectedImage, onImageSelect }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
        <Upload className="w-5 h-5 mr-2 text-emerald-500" />
        Medical Image (Optional)
      </h3>
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={onImageSelect}
          className="hidden"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {selectedImage
              ? selectedImage.name
              : "Click to upload medical image"}
          </p>
        </label>
      </div>
    </div>
  );
}

function ConsultationButton({ isLoading, hasInput, onConsult }) {
  return (
    <button
      onClick={onConsult}
      disabled={isLoading || !hasInput}
      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-8"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          <span>Start AI Consultation</span>
        </>
      )}
    </button>
  );
}

function ConsultationResults({ consultationResult, onPlayAudio }) {
  if (!consultationResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {consultationResult.transcription && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" />
            Your Description
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            {consultationResult.transcription}
          </p>
        </div>
      )}

      {consultationResult.analysis && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-emerald-500" />
            AI Analysis
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            {consultationResult.analysis}
          </p>
        </div>
      )}

      {consultationResult.response_audio && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            Audio Response
          </h3>
          <button
            onClick={() => onPlayAudio(consultationResult.response_audio)}
            className="inline-flex items-center space-x-2 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Play Response</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
