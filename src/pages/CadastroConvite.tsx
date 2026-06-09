import { useState, useEffect } from 'react';
import {
  Shield, User, Mail, Lock, Eye, EyeOff, Calendar, Building, Phone,
  CheckCircle, AlertCircle, Camera, ArrowLeft, Loader2, Check,
} from 'lucide-react';
import { db, type StoredInvite } from '../lib/storage';
import FaceCapture from '../components/FaceCapture';

type Step = 'loading' | 'expired' | 'not-found' | 'form' | 'photo' | 'success';

function getTokenFromHash(): string {
  // Tenta da hash (HashRouter: #/cadastro?token=xxx)
  const hash = window.location.hash || '';
  const qIdx = hash.indexOf('?');
  if (qIdx !== -1) {
    const params = new URLSearchParams(hash.substring(qIdx));
    const t = params.get('token');
    if (t) return t;
  }
  // Fallback: tenta da query string normal (?token=xxx)
  const search = window.location.search || '';
  if (search) {
    const params = new URLSearchParams(search);
    const t = params.get('token');
    if (t) return t;
  }
  // Fallback: tenta extrair token do path inteiro (caso WhatsApp tenha reformulado a URL)
  const full = window.location.href;
  const tokenMatch = full.match(/token=([^&]+)/);
  if (tokenMatch) return tokenMatch[1];
  return '';
}

export default function CadastroConvite() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = getTokenFromHash();
    console.log('[CadastroConvite] token from URL:', t, 'full URL:', window.location.href, 'hash:', window.location.hash);
    setToken(t);
  }, []);

  const [step, setStep] = useState<Step>('loading');
  const [invite, setInvite] = useState<StoredInvite | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', cpf: '', phone: '',
  });

  useEffect(() => {
    if (!token) {
      console.log('[CadastroConvite] no token, showing not-found');
      setStep('not-found');
      return;
    }
    (async () => {
      console.log('[CadastroConvite] looking up token:', token);
      const inv = await db.getInviteByToken(token);
      console.log('[CadastroConvite] invite result:', inv);
      if (!inv) {
        setStep('not-found');
        return;
      }
      const now = new Date();
      const expires = new Date(inv.expiresAt);
      if (inv.status === 'expired' || inv.status === 'cancelled' || expires < now) {
        setInvite(inv);
        setStep('expired');
        return;
      }
      if (inv.status === 'accepted') {
        setInvite(inv);
        setStep('expired');
        return;
      }
      setInvite(inv);
      setFormData({
        name: inv.name,
        email: inv.email,
        cpf: inv.cpf,
        phone: '',
      });
      setStep('form');
    })();
  }, [token]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setErrorMsg('A senha deve ter no mínimo 4 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não conferem.');
      return;
    }
    setErrorMsg('');
    setStep('photo');
  };

  const handlePhotoCapture = (photo: string) => {
    setFacePhoto(photo);
  };

  const handleFinalSubmit = async () => {
    if (!invite || !facePhoto) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Criar usuário
      const result = await db.createUser({
        email: formData.email,
        password,
        name: formData.name,
        role: 'colaborador',
        avatar: formData.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
        companyId: invite.companyId,
        companyName: '',
        isActive: true,
        createdBy: invite.createdBy,
      });

      if (result.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
        return;
      }

      const userId = result.user?.id || null;

      // 2. Criar funcionário
      await db.createEmployee({
        companyId: invite.companyId,
        userId,
        name: formData.name,
        email: formData.email,
        cpf: invite.cpf || formData.cpf,
        role: invite.role || 'Colaborador',
        department: invite.department || 'Geral',
        admissionDate: invite.admissionDate || new Date().toISOString().split('T')[0],
        birthDate: '',
        phone: formData.phone,
        isActive: true,
      });

      // 3. Atualizar convite com foto biométrica
      await db.updateInvite(invite.id, {
        status: 'accepted',
        facePhoto,
        faceVerified: true,
        faceCapturedAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(),
      });

      setStep('success');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao realizar cadastro. Tente novamente.');
    }

    setIsSubmitting(false);
  };

  // ========== Tela de carregamento ==========
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-slate-500">Carregando convite...</p>
        </div>
      </div>
    );
  }

  // ========== Convite não encontrado ==========
  if (step === 'not-found') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Convite não encontrado</h1>
          <p className="text-sm text-slate-500 mb-6">
            O link de convite é inválido ou não existe. Solicite um novo convite ao setor de RH.
          </p>
          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  // ========== Convite expirado/aceito ==========
  if (step === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {invite?.status === 'accepted' ? 'Convite já utilizado' : 'Convite expirado'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            {invite?.status === 'accepted'
              ? 'Este convite já foi utilizado para cadastro. Se precisar de ajuda, entre em contato com o RH.'
              : 'Este convite expirou ou foi cancelado. Solicite um novo convite ao setor de RH.'}
          </p>
          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  // ========== Sucesso ==========
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Cadastro realizado!</h1>
          <p className="text-sm text-slate-500 mb-2">
            Seu cadastro foi concluído com sucesso e sua identidade foi verificada.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">Validação Biométrica</span>
            </div>
            <p className="text-xs text-emerald-600">
              Sua foto foi vinculada ao cadastro com data e hora. Esta validação tem validade jurídica conforme normas de segurança do trabalho (NR-1).
            </p>
          </div>
          <a
            href="#/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Acessar o Sistema
          </a>
        </div>
      </div>
    );
  }

  // ========== Formulário de cadastro ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="fixed top-20 right-20 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        <a href="#/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o site
        </a>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-8 pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900">
                Nexo<span className="text-emerald-600">-SST</span>
              </span>
            </div>

            {step === 'form' ? (
              <>
                <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
                  Complete seu Cadastro
                </h1>
                <p className="text-sm text-slate-500 text-center mb-8">
                  Preencha seus dados e crie uma senha de acesso
                </p>

                {errorMsg && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-6 animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <p className="text-sm text-rose-700">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600"
                      />
                    </div>
                  </div>

                  {invite?.cpf && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">CPF</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={invite.cpf}
                          readOnly
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {invite?.role && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cargo</label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={invite.role}
                            readOnly
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600"
                          />
                        </div>
                      </div>
                    )}
                    {invite?.admissionDate && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Admissão</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={new Date(invite.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                            readOnly
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Criar senha *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={4}
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                        placeholder="Mínimo 4 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirmar senha *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={4}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                        placeholder="Repita a senha"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 active:scale-95"
                  >
                    <Camera className="w-5 h-5" />
                    Próximo: Validar Identidade
                  </button>
                </form>
              </>
            ) : (
              /* Step: Foto */
              <div className="space-y-4">
                {errorMsg && (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <p className="text-sm text-rose-700">{errorMsg}</p>
                  </div>
                )}

                <FaceCapture
                  onCapture={handlePhotoCapture}
                  onCancel={() => setStep('form')}
                />

                {facePhoto && (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-300 active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Finalizando cadastro...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirmar e Finalizar Cadastro
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cadastro com validação biométrica · NR-1</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          © {new Date().getFullYear()} Nexo-SST
        </p>
      </div>
    </div>
  );
}
