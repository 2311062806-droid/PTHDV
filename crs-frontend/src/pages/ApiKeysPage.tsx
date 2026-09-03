// purpose: trang quan tri API Key (chi ADMIN) - cap moi, thu hoi, xem danh sach
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getApiKeys, createApiKey, revokeApiKey } from '../api/apiKeyApi';
import type { ApiKey } from '../types/apiKey';
import type { ApiErrorResponse } from '../types/apiError';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState('');
  const [scopes, setScopes] = useState('courses:read');
  const [validDays, setValidDays] = useState('30');
  // newKeyValue chi hien thi 1 lan duy nhat ngay sau khi tao (giong GitHub/AWS)
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadKeys = useCallback(() => {
    setLoading(true);
    getApiKeys()
      .then((res) => setKeys(res.data))
      .catch(() => setError('Khong tai duoc danh sach API Key.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNewKeyValue(null);
    try {
      const res = await createApiKey({
        ownerName,
        scopes,
        validDays: validDays ? Number(validDays) : undefined,
      });
      // Hien thi 1 lan duy nhat de Admin copy - danh sach bên duoi khong hien lai keyValue
      setNewKeyValue(res.data.keyValue);
      setOwnerName('');
      loadKeys();
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Cap API Key khong thanh cong.');
      }
    }
  };

  const handleRevoke = async (key: ApiKey) => {
    if (!window.confirm(`Thu hoi API Key cua "${key.ownerName}"?`)) return;
    try {
      await revokeApiKey(key.id);
      loadKeys();
    } catch {
      alert('Thu hoi khong thanh cong.');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>Quan ly API Key doi tac</h1>

      {/* Form cap moi */}
      <form
        onSubmit={handleCreate}
        style={{
          border: '1px solid #d1d5db',
          padding: 20,
          borderRadius: 8,
          marginBottom: 28,
          background: '#f9fafb',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Cap API Key moi</h3>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            Ten doi tac
          </label>
          <input
            id="ownerName"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
            placeholder="Vi du: Cong ty ABC Edu"
            style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            Scopes (cach nhau boi dau phay)
          </label>
          <input
            id="scopes"
            value={scopes}
            onChange={(e) => setScopes(e.target.value)}
            required
            placeholder="Vi du: courses:read"
            style={{ width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#6b7280' }}>Scope hien co: courses:read</small>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            Hieu luc (so ngay, de trong = vinh vien)
          </label>
          <input
            id="validDays"
            type="number"
            value={validDays}
            onChange={(e) => setValidDays(e.target.value)}
            min={1}
            placeholder="30"
            style={{ width: 120, padding: '6px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
          />
        </div>

        {error && (
          <p style={{ color: '#b91c1c', background: '#fef2f2', padding: '8px 12px', borderRadius: 4 }}>
            {error}
          </p>
        )}

        <button
          id="btnCreateApiKey"
          type="submit"
          style={{
            padding: '8px 20px',
            background: '#1d4ed8',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Cap API Key
        </button>
      </form>

      {/* Hien thi key vua tao - chi 1 lan */}
      {newKeyValue && (
        <div
          style={{
            background: '#fef9c3',
            border: '1px solid #fde047',
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <strong>⚠️ Key vua tao (chi hien thi 1 lan duy nhat, hay luu lai ngay):</strong>
          <pre
            id="newKeyDisplay"
            style={{
              background: '#fff',
              padding: 12,
              borderRadius: 4,
              userSelect: 'all',
              fontFamily: 'monospace',
              fontSize: 14,
              margin: '8px 0 0',
              wordBreak: 'break-all',
            }}
          >
            {newKeyValue}
          </pre>
        </div>
      )}

      {/* Danh sach key */}
      {loading ? (
        <p>Dang tai...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #374151', background: '#f3f4f6' }}>
              <th style={{ padding: '10px 8px' }}>Doi tac</th>
              <th style={{ padding: '10px 8px' }}>Scopes</th>
              <th style={{ padding: '10px 8px' }}>Trang thai</th>
              <th style={{ padding: '10px 8px' }}>Het han</th>
              <th style={{ padding: '10px 8px' }}>Ngay cap</th>
              <th style={{ padding: '10px 8px' }}>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: '#6b7280' }}>
                  Chua co API Key nao. Cap key moi o form bên trên.
                </td>
              </tr>
            )}
            {keys.map((k) => (
              <tr key={k.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 8px', fontWeight: 500 }}>{k.ownerName}</td>
                <td style={{ padding: '10px 8px' }}>
                  <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: 3 }}>
                    {k.scopes}
                  </code>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <span
                    style={{
                      color: k.status === 'ACTIVE' ? '#15803d' : '#b91c1c',
                      fontWeight: 600,
                      background: k.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2',
                      padding: '2px 8px',
                      borderRadius: 12,
                    }}
                  >
                    {k.status}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', color: '#6b7280' }}>
                  {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString('vi-VN') : 'Vinh vien'}
                </td>
                <td style={{ padding: '10px 8px', color: '#6b7280' }}>
                  {new Date(k.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: '10px 8px' }}>
                  {k.status === 'ACTIVE' && (
                    <button
                      id={`btnRevoke-${k.id}`}
                      onClick={() => handleRevoke(k)}
                      style={{
                        padding: '4px 12px',
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      Thu hoi
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
