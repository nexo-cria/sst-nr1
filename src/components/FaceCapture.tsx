import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RotateCcw, Check, AlertCircle, Video, VideoOff, Upload } from 'lucide-react';

interface FaceCaptureProps {
  onCapture: (photoBase64: string) => void;
  onCancel?: () => void;
}

export default function FaceCapture({ onCapture, onCancel }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');

  const startCamera = useCallback(async () => {
    setIsStarting(true);
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
    } catch (err: any) {
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Permissão de câmera negada. Permita o acesso nas configurações do navegador.'
          : err.name === 'NotFoundError'
          ? 'Nenhuma câmera encontrada no dispositivo.'
          : 'Erro ao acessar a câmera. Tente novamente ou faça upload de uma foto.'
      );
    }
    setIsStarting(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCameraError('Por favor, selecione uma imagem válida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const photo = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(photo);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const photo = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(photo);
    stream?.getTracks().forEach(t => t.stop());
  }, [stream]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    setCameraError(null);
    if (mode === 'camera') {
      startCamera();
    }
  }, [startCamera, mode]);

  const confirmPhoto = useCallback(() => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
    }
  }, [capturedPhoto, onCapture]);

  const switchToUpload = () => {
    stream?.getTracks().forEach(t => t.stop());
    setMode('upload');
    setCameraError(null);
  };

  const switchToCamera = () => {
    setMode('camera');
    setCameraError(null);
    startCamera();
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Camera className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Validação de Identidade</h3>
        <p className="text-sm text-slate-500 mt-1">
          Posicione seu rosto centralizado e tire uma foto nítida.
          <br />
          <span className="text-xs text-slate-400">
            Esta foto será vinculada ao seu cadastro com validade jurídica.
          </span>
        </p>
      </div>

      {/* Toggle Câmera / Upload */}
      {!capturedPhoto && (
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={switchToCamera}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'camera' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            Câmera
          </button>
          <button
            onClick={switchToUpload}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            Enviar Foto
          </button>
        </div>
      )}

      {/* Área da câmera */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3]">
        {capturedPhoto ? (
          <img src={capturedPhoto} alt="Foto capturada" className="w-full h-full object-cover" />
        ) : mode === 'upload' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Upload className="w-12 h-12 text-slate-500 mb-3" />
            <p className="text-sm text-slate-300 mb-3">Envie uma foto do seu rosto</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Selecionar Foto
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <VideoOff className="w-12 h-12 text-slate-500 mb-3" />
            <p className="text-sm text-slate-300 mb-3">{cameraError}</p>
            <div className="flex gap-2">
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Tentar novamente
              </button>
              <button
                onClick={switchToUpload}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Enviar foto
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-60 border-2 border-dashed border-white/40 rounded-full" />
            </div>
            {!stream && !isStarting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Ativar câmera
                </button>
              </div>
            )}
            {isStarting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <p className="text-xs text-white/70">Iniciando câmera...</p>
                </div>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Dicas */}
      {!capturedPhoto && !cameraError && mode === 'camera' && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700 space-y-1">
              <p className="font-semibold">Dicas para uma boa foto:</p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-600">
                <li>Olhe diretamente para a câmera</li>
                <li>Esteja em um local com boa iluminação</li>
                <li>Remova óculos escuros, se possível</li>
                <li>Mantenha o rosto centralizado no guia</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {mode === 'upload' && !capturedPhoto && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700">
              <p className="font-semibold">Dicas para upload:</p>
              <p className="mt-1">Envie uma selfie recente com o rosto bem visível e iluminado.</p>
            </div>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3">
        {capturedPhoto ? (
          <>
            <button
              onClick={retakePhoto}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refazer
            </button>
            <button
              onClick={confirmPhoto}
              className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirmar Foto
            </button>
          </>
        ) : (
          <>
            {onCancel && (
              <button
                onClick={() => {
                  stream?.getTracks().forEach(t => t.stop());
                  onCancel();
                }}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            )}
            {mode === 'camera' && (
              <button
                onClick={capturePhoto}
                disabled={!stream || !!cameraError}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
                Tirar Foto
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
