// src/components/FileUpload/FileUpload.js
'use client';
import { useState } from 'react';

export default function FileUpload({ onPointsLoaded }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setError('');

    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (fileType !== 'csv' && fileType !== 'txt') {
        setError('Please upload only CSV or TXT files');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    // Skip header if exists
    const startIndex = lines[0].toLowerCase().includes('latitude') ? 1 : 0;
    
    return lines.slice(startIndex).map(line => {
      const [latitude, longitude, elevation = 0] = line.split(',').map(val => parseFloat(val.trim()));
      
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid data format');
      }

      return {
        latitude,
        longitude,
        elevation: isNaN(elevation) ? 0 : elevation
      };
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      const text = await file.text();
      console.log(text);
      const points = parseCSV(text);
      onPointsLoaded(points);
      setFile(null);
    } catch (err) {
      setError('Error processing file. Please check the file format.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`px-4 py-2 rounded-lg text-white font-medium
            ${file ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Upload
        </button>
      </div>
      
      {file && (
        <p className="text-sm text-gray-600">
          Selected file: {file.name}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}