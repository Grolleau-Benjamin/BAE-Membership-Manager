import React, { useState } from 'react';
import '../assets/styles/Form.css';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../functions/fetch';

interface AdherentFormProps {
  addAdherent: (adherent: any) => void;
  closeForm: () => void;
  setError: React.Dispatch<React.SetStateAction<string | boolean>>;
}

const AdherentForm: React.FC<AdherentFormProps> = ({ addAdherent, closeForm, setError }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    name: '',
    dateAdherence: '',
    nbYears: 1,
  });

  const { token, logout } = useAuth();
  const [enableDate, setEnableDate] = useState(false);
  const [enableNbYears, setEnableNbYears] = useState(false);

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "nbYears" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      firstname: formData.firstname,
      name: formData.name,
      ...(enableDate && { dateAdherence: formData.dateAdherence || getTodayDate() }),
      ...(enableNbYears && { nbYears: formData.nbYears }),
    };

    const url = `${import.meta.env.VITE_API_URL}/adherents`;

    const result = await fetchWithAuth(url, 'POST', token, submitData);

    if (result?.logout) {
      logout();
    } else if (result?.error) {
      setError(result.error);
    } else {
      addAdherent(result);
      closeForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="input-group">
        <label>Nom:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom"
          required
        />
      </div>

      <div className="input-group">
        <label>Prénom:</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="Prénom"
          required
        />
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={enableDate}
            onChange={() => {
              setEnableDate(!enableDate);
              if (!enableDate) {
                setFormData({ ...formData, dateAdherence: getTodayDate() });
              }
            }}
          />
          Activer la date d'adhésion (Aujourd'hui)
        </label>
      </div>

      {enableDate && (
        <div className="input-group">
          <label>Date d'adhésion:</label>
          <input
            type="date"
            name="dateAdherence"
            value={formData.dateAdherence}
            onChange={handleChange}
            placeholder="Date d'adhésion"
          />
        </div>
      )}

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={enableNbYears}
            onChange={() => {
              setEnableNbYears(!enableNbYears);
              if (!enableNbYears) {
                setFormData({ ...formData, nbYears: 1 });
              }
            }}
          />
          Activer le nombre d'années (1 an)
        </label>
      </div>

      {enableNbYears && (
        <div className="input-group">
          <label>Nombre d'années d'adhésion:</label>
          <input
            type="number"
            name="nbYears"
            value={formData.nbYears}
            onChange={handleChange}
            placeholder="Nombre d'années"
            min="1"
            max="3"
            required
          />
        </div>
      )}

      <button type="submit" className="submit-btn">Ajouter</button>
    </form>
  );
};

export default AdherentForm;
