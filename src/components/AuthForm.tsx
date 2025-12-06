import { useState } from 'react';
import { auth } from '../lib/api';
import { Bitcoin } from 'lucide-react';

interface AuthFormProps {
  onAuthComplete: () => void;
}

export function AuthForm({ onAuthComplete }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Xử lý đăng nhập/đăng ký đơn giản - chỉ cần email và password
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Đăng nhập
        await auth.login(email.trim(), password);
        // Đăng nhập thành công
        onAuthComplete();
      } else {
        // Đăng ký
        await auth.register(email.trim(), password, fullName.trim() || undefined);
        // Đăng ký thành công - tự động đăng nhập
        onAuthComplete();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        setError('Email này đã được đăng ký. Vui lòng đăng nhập.');
      } else if (errorMessage.includes('Invalid email or password')) {
        setError('Email hoặc mật khẩu không đúng');
      } else {
        setError(errorMessage);
      }
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b1d] flex items-center justify-center p-4">
      <div className="bg-[#2F3133] rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#F263B0] p-4 rounded-full">
            <Bitcoin className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Bitcoin Trading Platform
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {isLogin ? 'Đăng nhập' : 'Tạo tài khoản mới'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Tên (Tùy chọn)</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="w-full bg-[#1a1b1d] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F263B0] transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full bg-[#1a1b1d] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F263B0] transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className="w-full bg-[#1a1b1d] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F263B0] transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F263B0] text-white py-4 rounded-lg font-semibold hover:bg-[#e055a0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#F263B0]/30 hover:shadow-[#F263B0]/50"
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
              setFullName('');
            }}
            className="text-[#F263B0] hover:text-[#e055a0] font-medium transition-colors"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
