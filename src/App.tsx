import React, { useState, useEffect } from "react";
import "./App.css";
import { motion } from "framer-motion";
import logo from "/assets/Logo.svg";
 

interface Verb {
  id: number;
  lu: string;
  en: string;
  fr: string;
  de: string;
  all: string;
  videoUrl: string;
}

interface Category {
  type: string;
  verbs: Verb[];
}

const categoryColors: Record<string, string> = {
  "Auxiliary verbs": "bg-slate-600 hover:bg-green-800",
  "Modal verbs": "bg-slate-700 hover:bg-green-800",
  "Irregular verbs": "bg-slate-800 hover:bg-green-800",
  "Regular verbs": "bg-slate-900 hover:bg-green-800"
};

const App: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const [currentType, setCurrentType] = useState<Category | null>(null);
  const [currentVerb, setCurrentVerb] = useState<Verb | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await fetch(
            "https://cors-anywhere.herokuapp.com/https://grist.skilltech.tools/api/docs/bnxws71sTCDzixcjGA6mqw/tables/LesVerbes/records",
            {
              method: "GET",
              headers: {
                "Origin": "https://grist.skilltech.tools", // Fake origin pour bypass
                "X-Requested-With": "XMLHttpRequest" // Obligatoire pour certains proxys
              }
            }
          );

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${text}`);
          }

        const jsonData = await response.json();

        // Transformation des données de Grist en catégories structurées
        const groupedData: Record<string, Verb[]> = {};

        jsonData.records.forEach((record: any) => {
          const fields = record.fields;
          const type = fields.Type; // Type de verbe (ex: "Auxiliary")
          
          // Construction de l'objet Verbe
          const verb: Verb = {
            id: record.id,
            lu: fields.LU,
            en: fields.EN,
            fr: fields.FR,
            de: fields.DE,
            all: fields.All, // Nettoyage des espaces inutiles
            videoUrl: fields.video_embed || "" // Si vide, évite une erreur
          };

          // Ajout du verbe dans la bonne catégorie
          if (!groupedData[type]) {
            groupedData[type] = [];
          }
          groupedData[type].push(verb);
        });

        // Convertir l'objet en un tableau de catégories
        const transformedData: Category[] = Object.keys(groupedData).map((type) => ({
          type,
          verbs: groupedData[type]
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data from Grist:", error);
      }
    };

    fetchData();
  }, []);

  const renderHeader = () => (
    <header className="sticky top-0 bg-white shadow-md w-full p-4 z-10 flex items-center justify-center transition duration-300">
      <div className="flex items-center">
        <img src={logo} alt="Lux By Heart" className="w-32 h-16 object-contain" />
      </div>

 
    </header>
  );

  const renderHome = () => {
    // Récupère tous les verbes et les trie par ordre alphabétique
    const allVerbs = data.flatMap(category => category.verbs).sort((a, b) => a.lu.localeCompare(b.lu));
  
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="home flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8"
      >
        {/* Boutons de catégories */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 w-full max-w-4xl mt-8">
          {data.map((category) => (
            <motion.button
              key={category.type}
              onClick={() => setCurrentType(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 text-white rounded-lg shadow-md transition duration-300 ${categoryColors[category.type] || "bg-gray-500 hover:bg-gray-600"}`}
            >
              {category.type}
            </motion.button>
          ))}
        </div>
  
        {/* Liste complète des verbes triés alphabétiquement */}
        <div className="w-full max-w-4xl mt-8 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Liste complète des verbes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allVerbs.map((verb) => (
              <motion.button 
                key={verb.id} 
                onClick={() => setCurrentVerb(verb)} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="p-4 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition duration-300 flex flex-col items-center"
              >
                {/* Verbe principal */}
                <h1 className="text-xl font-bold">{verb.lu}</h1>
  
                {/* Drapeaux + Traductions */}
                <div className="flex flex-col mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-6 h-4" />
                    <span className="text-sm">{verb.en}</span>
                  </div>
  
                  <div className="flex items-center space-x-2">
                    <img src="https://flagcdn.com/w40/fr.png" alt="Français" className="w-6 h-4" />
                    <span className="text-sm">{verb.fr}</span>
                  </div>
  
                  <div className="flex items-center space-x-2">
                    <img src="https://flagcdn.com/w40/de.png" alt="Deutsch" className="w-6 h-4" />
                    <span className="text-sm">{verb.de}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };
  

  const renderVerbList = () => (
    <motion.div initial={{ x: 500, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -400, opacity: 0 }} className="verb-list flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-2 pt--10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 transition duration-300">
        {currentType?.type}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {currentType?.verbs.map((verb) => (
          <motion.button key={verb.id} onClick={() => setCurrentVerb(verb)} 
  whileHover={{ scale: 1.05 }} 
  whileTap={{ scale: 0.95 }} 
  className="p-4 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-300 flex flex-col items-center"
>
  <h1 className="text-3xl font-bold mb-4">{verb.lu}</h1>

  {/* Remplace <p> par <div> pour éviter l'erreur */}
  <div className="flex flex-col space-y-0">
    <div className="flex items-center space-x-2">
      <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-7 h-5" />
      <span>{verb.en}</span>
    </div>

    <div className="flex items-center space-x-2">
      <img src="https://flagcdn.com/w40/fr.png" alt="Français" className="w-7 h-5" />
      <span>{verb.fr}</span>
    </div>

    <div className="flex items-center space-x-2">
      <img src="https://flagcdn.com/w40/de.png" alt="Deutsch" className="w-7 h-5" />
      <span>{verb.de}</span>
    </div>
  </div>
</motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderVerbDetails = () => (
<motion.div 
  initial={{ scale: 0.8, opacity: 0 }} 
  animate={{ scale: 1, opacity: 1 }} 
  exit={{ scale: 0.8, opacity: 0 }} 
  className="verb-details flex flex-col items-center justify-center   bg-gradient-to-b from-gray-100 to-gray-300 p-4  ">
  {/* Verbe principal */}
  <h1 className="text-6xl font-black text-gray-600 mb-2 transition duration-300">
    {currentVerb?.lu}
  </h1>

  {/* Ligne avec les drapeaux + texte */}
  <div className="flex items-center space-x-4 text-lg text-gray-600 mb-10">
    <div className="flex items-center space-x-2">
      <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-7 h-5" />
      <span>{currentVerb?.en}</span>
    </div>

    <div className="flex items-center space-x-2">
      <img src="https://flagcdn.com/w40/fr.png" alt="Français" className="w-7 h-5" />
      <span>{currentVerb?.fr}</span>
    </div>

    <div className="flex items-center space-x-2">
      <img src="https://flagcdn.com/w40/de.png" alt="Deutsch" className="w-7 h-5" />
      <span>{currentVerb?.de}</span>
    </div>
  </div>

  {/* Texte en luxembourgeois */}
  <pre className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-3xl mb-6 whitespace-pre-wrap">
    {currentVerb?.all}
  </pre>



  {/* Vidéo */}
  <div className="w-full max-w-3xl" dangerouslySetInnerHTML={{ __html: currentVerb?.videoUrl || "" }} />
</motion.div>

  );


  const renderBackButton = () => {
    if (!currentType && !currentVerb) return null; // N'affiche pas le bouton sur la page d'accueil
  
    return (
      <button
        onClick={() => {
          setCurrentType(null);
          setCurrentVerb(null);
        }}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span className="hidden md:inline">Back</span> {/* Masque le texte sur mobile */}
      </button>
    );
  };

  return (
    <div className="app">
      {renderHeader()}
      <div className="fade-in">
        {!currentType && !currentVerb && renderHome()}
        {currentType && !currentVerb && renderVerbList()}
        {currentVerb && renderVerbDetails()}
      </div>
      {renderBackButton()} {/* Affichage du bouton flottant */}
    </div>
  );
};

export default App;
