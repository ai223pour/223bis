import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const navigate = useNavigate();
  const [formations, setFormations] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filter, setFilter] = React.useState('Tous les types');
  const [currentPage, setCurrentPage] = React.useState(1);
  const formationsPerPage = 500;

  React.useEffect(() => {
    fetchFormations();
  }, [currentPage]);

  async function fetchFormations() {
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .range((currentPage - 1) * formationsPerPage, currentPage * formationsPerPage - 1);

    if (error) {
      console.error('Error fetching formations:', error);
    } else {
      setFormations(data);
    }
  }

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = Object.values(formation)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'Tous les types' || formation.voie === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Educational Platform</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Le site est un outil servant à aider les élèves à estimer leur chance d'obtenir une place 
          dans une formation sur Parcoursup en auto-évaluant leur dossier grâce à une moyenne des 
          notes principalement attendues par la filière.
        </p>
      </div>

      <div className="mb-8 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une formation..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Tous les types</option>
          <option>BTS</option>
          <option>BUT</option>
          <option>CPGE</option>
          <option>Licences</option>
          <option>Autres</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etablissement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ville
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Filiere
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Voie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Places
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredFormations.map((formation) => (
              <tr
                key={formation.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/formation/${formation.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{formation.etablissement}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formation.departement}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formation.ville}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formation.filiere}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formation.voie}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formation.places}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          disabled={formations.length < formationsPerPage}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}