import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Educational Platform</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}