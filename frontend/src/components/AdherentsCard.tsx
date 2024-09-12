import React, { useState } from 'react';
import Adherent from '../types/Adherent';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../functions/fetch'; 
import '../assets/styles/AdherentCard.css';

interface AdherentCardProps {
  adherent: Adherent;
  deleteAdherent: (_id: string) => void;
  updateAdherent: (updatedAdherent: Adherent) => void;
  setError: React.Dispatch<React.SetStateAction<string | boolean>>;
}

const InputField: React.FC<{ 
  label: string, 
  name: string, 
  value: string | number, 
  onChange: any, 
  type?: string, 
  min?: number, 
  max?: number 
}> = ({ label, name, value, onChange, type = 'text', min, max }) => (
  <div className="input-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      min={min} 
      max={max} 
    />
  </div>
);

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const calculateEndDate = (dateAdherence: string, nbYears: number) => {
  const adherenceDate = new Date(dateAdherence);
  adherenceDate.setFullYear(adherenceDate.getFullYear() + nbYears);
  const year = adherenceDate.getFullYear();
  const month = String(adherenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(adherenceDate.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

const areObjectsEqual = (obj1: Adherent, obj2: Adherent) => {
  const baseDate = new Date(obj1.dateAdherence).toISOString().split('T')[0];
  const diffDate = new Date(obj2.dateAdherence).toISOString().split('T')[0];

  return (
    obj1.firstname === obj2.firstname &&
    obj1.name === obj2.name &&
    baseDate === diffDate &&
    obj1.nbYears === obj2.nbYears
  );
};

const isAdherenceValid = (dateAdherence: string, nbYears: number) => {
  const adherenceDate = new Date(dateAdherence);
  adherenceDate.setFullYear(adherenceDate.getFullYear() + nbYears);
  return adherenceDate >= new Date();
};

const AdherentCard: React.FC<AdherentCardProps> = ({ adherent, setError, deleteAdherent, updateAdherent }) => {
  const [diff, setDiff] = useState<Adherent>({
    ...adherent,
    dateAdherence: formatDateForInput(adherent.dateAdherence),
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { token, logout } = useAuth();

  const endDate = calculateEndDate(adherent.dateAdherence, adherent.nbYears);
  const isModified = !areObjectsEqual(adherent, diff);
  const isValid = isAdherenceValid(adherent.dateAdherence, adherent.nbYears);

  const handlePatch = async () => {
    const url = `${import.meta.env.VITE_API_URL}/adherents/${adherent._id}`;
    const result = await fetchWithAuth(url, "PATCH", token, diff);
    if (result?.logout) {
      logout();
    } else if (result?.error) {
      setError(result.error);
    } else {
      updateAdherent(result);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async () => {
    const url = `${import.meta.env.VITE_API_URL}/adherents/${adherent._id}`;
    const result = await fetchWithAuth(url, "DELETE", token);
    if (result?.logout) {
      logout();
    } else if (result?.error) {
      setError(result.error);
    } else {
      deleteAdherent(result._id);
      setIsModalOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDiff({
      ...diff,
      [name]: name === "nbYears" ? parseInt(value, 10) : value,
    });
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className={`adherentCard ${!isValid ? 'invalid' : ''}`}>
      <div className="adherent-header">
        <div className="adherent-info">
          <h1>{adherent.firstname} {adherent.name}</h1>
          <p className="adherent-id">ID: {adherent._id}</p>
          <p className="adherent-end-date">
            Fin le {endDate} ({adherent.nbYears} ans)
          </p>
        </div>
        <button className="collapse-btn" onClick={toggleModal}>
          Modifier/Supprimer
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={toggleModal}>&times;</span>
            <h2>Modifier Adhérent</h2>

            <InputField
              label="First name"
              name="firstname"
              value={diff.firstname}
              onChange={handleChange}
            />
            <InputField
              label="Last name"
              name="name"
              value={diff.name}
              onChange={handleChange}
            />
            <InputField
              label="Date of Adherence"
              name="dateAdherence"
              value={diff.dateAdherence}
              onChange={handleChange}
              type="date"
            />
            <InputField
              label="Years of Membership"
              name="nbYears"
              value={diff.nbYears}
              onChange={handleChange}
              type="number"
              min={1}
              max={3}
            />

            <button
              className={`btn-action ${isModified ? "btn-update" : "btn-delete"}`}
              onClick={isModified ? handlePatch : handleDelete}
            >
              {isModified ? "Mettre à jour" : "Supprimer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdherentCard;
