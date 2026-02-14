
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import publicApi from "../../../api/publicApi";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await publicApi.resetPassword(token, password,passwordConfirmation);
      setSuccess("Mot de passe réinitialisé ! Redirection vers login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err?.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto border rounded-lg shadow p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Réinitialiser le mot de passe</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="border px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="border px-4 py-2 rounded"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
