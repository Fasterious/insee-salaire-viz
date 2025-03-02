'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseClient() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [tables, setTables] = useState<string[]>([]);
  
  async function fetchData() {
    try {
      setLoading(true);
      setDebugInfo('Tentative de connexion à Supabase...');
      
      // Récupérer la liste des tables pour déboguer
      const { data: tableList, error: tableError } = await supabase
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (tableList) {
        const tableNames = tableList.map((t: any) => t.tablename);
        setTables(tableNames);
        setDebugInfo(`Tables trouvées: ${tableNames.join(', ')}`);
        
        if (!tableNames.includes('salary_centiles')) {
          setDebugInfo('⚠️ La table salary_centiles n\'existe pas dans la base de données!');
          setData([]);
          setLoading(false);
          return;
        }
      }
      
      // Récupérer les données de salary_centiles
      const { data, error } = await supabase
        .from('salary_centiles')
        .select('*')
        .order('centile', { ascending: true });
      
      if (error) {
        setDebugInfo(`Erreur: ${error.message}`);
        throw error;
      }
      
      setDebugInfo(`${data?.length || 0} enregistrements récupérés`);
      setData(data || []);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }
  
  // Vérifier si RLS bloque l'accès
  async function checkRLS() {
    try {
      setDebugInfo('Vérification des politiques RLS...');
      
      const { data, error } = await supabase.rpc('get_policies');
      
      if (error) {
        setDebugInfo(`Erreur lors de la vérification RLS: ${error.message}`);
      } else if (data && data.length > 0) {
        const policies = data.filter((p: any) => p.table === 'salary_centiles');
        if (policies.length === 0) {
          setDebugInfo('⚠️ Aucune politique RLS trouvée pour salary_centiles. Cela peut bloquer l\'accès.');
        } else {
          setDebugInfo(`Politiques trouvées pour salary_centiles: ${policies.length}`);
        }
      }
    } catch (err: any) {
      setDebugInfo(`Erreur RLS: ${err.message}`);
    }
  }
  
  // Premier chargement
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Données de salaires par centile</h2>
      
      <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
        <p className="font-bold">Statut: {loading ? "Chargement..." : error ? "Erreur" : data.length === 0 ? "Aucune donnée" : "Données chargées"}</p>
        <p>Debug: {debugInfo}</p>
        
        {tables.length > 0 && (
          <p className="mt-1">Tables disponibles: {tables.join(', ')}</p>
        )}
        
        <div className="mt-2 space-x-2">
          <button 
            onClick={() => fetchData()}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Rafraîchir les données'}
          </button>
          
          <button 
            onClick={() => checkRLS()}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            Vérifier RLS
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Chargement des données...</p>
      ) : error ? (
        <div className="text-red-500">
          <p>Erreur: {error}</p>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <h3 className="font-bold">Suggestions:</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>Vérifiez que la table 'salary_centiles' existe bien dans votre base Supabase</li>
              <li>Vérifiez les paramètres RLS (Row Level Security)</li>
              <li>Assurez-vous que votre clé API a les permissions nécessaires</li>
            </ul>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div>
          <p>Aucune donnée trouvée dans la table 'salary_centiles'</p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-bold">Vérifiez ces points :</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>Avez-vous bien inséré des données dans la table ?</li>
              <li>Vérifiez que RLS (Row Level Security) ne bloque pas l'accès</li>
              <li>Si RLS est activé, créez une politique qui permet SELECT</li>
              <li>Essayez de désactiver temporairement RLS pour tester</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-2">Données récupérées: {data.length} enregistrements</p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 text-left">Centile</th>
                  <th className="py-2 px-4 text-left">Salaire</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{item.centile}</td>
                    <td className="py-2 px-4">{item.salary_value?.toLocaleString?.('fr-FR') || item.salary_value} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 