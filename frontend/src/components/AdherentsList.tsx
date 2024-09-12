import React, { useState, useMemo, useCallback } from 'react';
import AdherentCard from '../components/AdherentsCard';
import Adherent from '../types/Adherent';
import AdherentForm from './AdherentsForm';

interface AdherentsListProps {
  adherents: Adherent[];
  setAdherents: React.Dispatch<React.SetStateAction<Adherent[]>>;
  setError: React.Dispatch<React.SetStateAction<string | boolean>>;
}

const AdherentsList: React.FC<AdherentsListProps> = ({ adherents, setError, setAdherents }) => {
  const [filter, setFilter] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

  const filteredList = useMemo(() => {
    return adherents.filter((a) => {
      const fullName = `${a.firstname} ${a.name}`.toLowerCase();
      return fullName.includes(filter.toLowerCase());
    });
  }, [filter, adherents]);

  const deleteAdherent = useCallback((_id: string) => {
    const updatedList = adherents.filter((a) => a._id !== _id);
    setAdherents(updatedList);
  }, [adherents, setAdherents]);

  const updateAdherent = useCallback((updatedAdherent: Adherent) => {
    const updatedList = adherents.map((a) => {
      if (a._id === updatedAdherent._id) {
        return { ...a, ...updatedAdherent };
      }
      return a;
    });
    setAdherents(updatedList);
  }, [adherents, setAdherents]);

  const addAdherent = useCallback((newAdherent: Adherent) => {
    setAdherents([...adherents, newAdherent]);
  }, [adherents, setAdherents]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <h1 className="main-title">Recherche</h1>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Rechercher par prénom ou nom"
        className="search-input"
      />

      <h1 className="list-title">
        Liste des adhérents
        <i
          className={`fa ${showForm ? 'fa-minus' : 'fa-plus'}`}
          aria-hidden="true"
          style={{
            marginLeft: '10px',
            cursor: 'pointer',
            border: 'solid 3px black',
            borderRadius: '50%',
            padding: '5px'
          }}
          onClick={toggleForm}
        ></i>
      </h1>

      {showForm && (
        <AdherentForm
          addAdherent={addAdherent}
          closeForm={toggleForm}
          setError={setError}
        />
      )}

      <div className="adherentsList">
        {filteredList.map((a: Adherent) => (
          <AdherentCard
            key={a._id}
            adherent={a}
            deleteAdherent={deleteAdherent}
            updateAdherent={updateAdherent}
            setError={setError}
          />
        ))}
      </div>
    </>
  );
};

export default AdherentsList;
