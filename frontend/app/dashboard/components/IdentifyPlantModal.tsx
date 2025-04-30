// dashboard/components/IdentifyPlantModal.tsx
import React, { useState } from 'react';

interface IdentifyPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IdentificationResult {
  scientificName: string;
  commonNames: string[];
}

const IdentifyPlantModal: React.FC<IdentifyPlantModalProps> = ({ isOpen, onClose }) => {
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [identificationResult, setIdentificationResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOrganChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedOrgans(options);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setIdentificationResult(null);

    if (!images.length) {
      setError('Please upload at least one image.');
      setLoading(false);
      return;
    }

    if (!selectedOrgans.length) {
      setError('Please select at least one plant organ.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    selectedOrgans.forEach((organ) => {
      formData.append('organs', organ);
    });

    try {
      const response = await fetch('http://localhost:5000/identify-plant', {
        method: 'POST',
        body: formData,
    });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.error || `HTTP error! status: ${response.status}`);
      } else {
        const result: IdentificationResult = await response.json();
        setIdentificationResult(result);
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg px-8 py-6 shadow-xl transform transition-all sm:max-w-md sm:w-full">
          <h2 className="text-lg font-medium mb-4">Identify Plant</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="organs" className="block text-gray-700 text-sm font-bold mb-2">
                Plant Organ(s):
              </label>
              <select
                id="organs"
                multiple
                value={selectedOrgans}
                onChange={handleOrganChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="flower">Flower</option>
                <option value="leaf">Leaf</option>
                <option value="fruit">Fruit</option>
                <option value="stem">Stem</option>
                <option value="bark">Bark</option>
                <option value="habit">Habit (overall appearance)</option>
              </select>
              <p className="text-gray-600 text-xs italic">Select one or more relevant organs.</p>
            </div>
            <div className="mb-4">
              <label htmlFor="images" className="block text-gray-700 text-sm font-bold mb-2">
                Plant Image(s):
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <p className="text-gray-600 text-xs italic">Upload one or more images of the plant.</p>
            </div>
            <div className="flex items-center justify-between">
              <button
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Identifying...' : 'Identify'}
              </button>
              <button
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          {identificationResult && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-md font-semibold">Identification Result:</h3>
              <p>
                <strong>Scientific Name:</strong> {identificationResult.scientificName || 'Unknown'}
              </p>
              {identificationResult.commonNames && identificationResult.commonNames.length > 0 && (
                <p>
                  <strong>Common Names:</strong> {identificationResult.commonNames.join(', ') || 'None'}
                </p>
              )}
              {identificationResult.commonNames && identificationResult.commonNames.length === 0 && (
                <p>
                  <strong>Common Names:</strong> None
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentifyPlantModal;