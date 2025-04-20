import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createCheckoutSession } from '../lib/stripe';
import { products } from '../stripe-config';

export default function FormationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [tokens, setTokens] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);

  React.useEffect(() => {
    checkUser();
    if (id) fetchFormation(id);
  }, [id]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data } = await supabase
        .from('user_tokens')
        .select('tokens')
        .eq('user_id', user.id)
        .single();
      setTokens(data?.tokens || 0);
    }
    setLoading(false);
  }

  async function fetchFormation(formationId: string) {
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('id', formationId)
      .single();

    if (error) {
      console.error('Error fetching formation:', error);
      navigate('/');
    } else {
      setFormation(data);
    }
  }

  const handlePurchaseTokens = async () => {
    try {
      setCheckoutLoading(true);
      await createCheckoutSession(products.v6bolt.priceId, products.v6bolt.mode);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Une erreur est survenue lors de la création de la session de paiement.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Accès Restreint</h2>
        <p className="mb-4">Veuillez vous connecter pour accéder aux détails de la formation.</p>
        <button
          onClick={() => navigate('/auth')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Se connecter
        </button>
      </div>
    );
  }

  if (tokens === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tokens Insuffisants</h2>
        <p className="mb-4">Vous n'avez pas assez de tokens pour accéder à cette information.</p>
        <button
          onClick={handlePurchaseTokens}
          disabled={checkoutLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {checkoutLoading ? 'Chargement...' : 'Acheter des Tokens'}
        </button>
      </div>
    );
  }

  if (!formation) {
    return <div className="text-center mt-8">Formation non trouvée</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Détails de la Formation</h2>
      <div className="space-y-4">
        <div>
          <label className="font-medium">Établissement:</label>
          <p>{formation.etablissement}</p>
        </div>
        <div>
          <label className="font-medium">Département:</label>
          <p>{formation.departement}</p>
        </div>
        <div>
          <label className="font-medium">Ville:</label>
          <p>{formation.ville}</p>
        </div>
        <div>
          <label className="font-medium">Filière:</label>
          <p>{formation.filiere}</p>
        </div>
        <div>
          <label className="font-medium">Voie:</label>
          <p>{formation.voie}</p>
        </div>
        <div>
          <label className="font-medium">Places:</label>
          <p>{formation.places}</p>
        </div>
        <div className="pt-4 border-t">
          <p className="text-lg font-medium">
            La formation "{formation.filiere}" est évaluée par la notation suivante "{formation.notes}".
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        Retour
      </button>
    </div>
  );
}