import React, { useState } from "react";

const App = () => {
  const [disease, setDisease] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDiseaseData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    // 1. Try fetching from local JSON file
    try {
      const localResponse = await fetch("/diseases.json");
      const localDiseases = await localResponse.json();
      const lowerCaseDisease = disease.toLowerCase();

      if (localDiseases[lowerCaseDisease]) {
        setData(localDiseases[lowerCaseDisease]);
        setLoading(false);
        return;
      }
    } catch (jsonError) {
      console.error("Local JSON fetch error:", jsonError);
    }

    // 2. Try fetching from a better public API
    try {
      const apiResponse = await fetch(
        `https://disease-info-api.vercel.app/diseases?name=${disease}`
      );
      const apiData = await apiResponse.json();

      if (apiData.length > 0) {
        setData({
          symptoms: apiData[0].symptoms || ["No symptoms found"],
          precautions: apiData[0].precautions || ["No precautions found"],
        });
      } else {
        setError("Disease not found.");
      }
    } catch (apiError) {
      console.error("API fetch error:", apiError);
      setError("Failed to fetch data.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Disease Symptoms & Precautions</h1>
      <input
        type="text"
        value={disease}
        onChange={(e) => setDisease(e.target.value)}
        placeholder="Enter disease name"
        className="p-2 border border-gray-400 rounded-md mb-2 w-64 text-center"
      />
      <button
        onClick={fetchDiseaseData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      
      {data && (
        <div className="mt-4 bg-white p-4 rounded shadow-lg text-center w-72">
          <h2 className="text-xl font-semibold">Symptoms</h2>
          <ul className="list-disc list-inside">
            {data.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mt-2">Precautions</h2>
          <ul className="list-disc list-inside">
            {data.precautions.map((precaution, index) => (
              <li key={index}>{precaution}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
