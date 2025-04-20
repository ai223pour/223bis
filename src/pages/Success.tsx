import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Paiement réussi !</h2>
        <p className="text-gray-600 mb-6">
          Votre paiement a été traité avec succès. Vous pouvez maintenant accéder aux détails des formations.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}