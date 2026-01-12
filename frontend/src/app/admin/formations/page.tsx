'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';

interface Formation {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: 'pigmentation' | 'regard_sourcils';
  subcategory: 'cils' | 'levres' | 'sourcils';
  level: 'debutant' | 'intermediaire' | 'avance';
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminFormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    subcategory: 'sourcils' as 'cils' | 'levres' | 'sourcils',
    level: 'debutant' as 'debutant' | 'intermediaire' | 'avance',
    imageUrl: ''
  });

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/formations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFormations(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    }
  };

  // ⭐ UPLOAD IMAGE (comme prestations)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image trop volumineuse (max 5MB)');
      return;
    }

    setUploadingImage(true);

    try {
      const token = localStorage.getItem('adminToken');
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${API_URL}/admin/upload/formation-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.data.imageUrl }));
        setImagePreview(`${API_URL}${data.data.imageUrl}`);
      } else {
        alert(data.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingFormation
        ? `${API_URL}/formations/${editingFormation.id}`
        : `${API_URL}/formations`;

      const response = await fetch(url, {
        method: editingFormation ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          category: 'pigmentation' // Valeur par défaut en dur
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(editingFormation ? '✅ Formation modifiée !' : '✅ Formation créée !');
        setShowModal(false);
        resetForm();
        fetchFormations();
      } else {
        alert(data.message || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (formation: Formation) => {
    setEditingFormation(formation);
    setFormData({
      title: formation.title,
      description: formation.description,
      price: formation.price.toString(),
      duration: formation.duration,
      subcategory: formation.subcategory,
      level: formation.level,
      imageUrl: formation.imageUrl || ''
    });
    
    if (formation.imageUrl) {
      setImagePreview(`${API_URL}${formation.imageUrl}`);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('❌ Supprimer cette formation ?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/formations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Formation supprimée !');
        fetchFormations();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleActive = async (formation: Formation) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/formations/${formation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formation,
          isActive: !formation.isActive
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchFormations();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      subcategory: 'sourcils',
      level: 'debutant',
      imageUrl: ''
    });
    setEditingFormation(null);
    setImagePreview('');
  };

  const subcategoryLabels = {
    cils: 'Cils',
    levres: 'Lèvres',
    sourcils: 'Sourcils'
  };

  const levelLabels = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé'
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📚 Gestion des Formations</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            + Nouvelle Formation
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Titre</th>
                <th className="text-left p-4 font-semibold text-gray-900">Sous-catégorie</th>
                <th className="text-left p-4 font-semibold text-gray-900">Prix</th>
                <th className="text-left p-4 font-semibold text-gray-900">Durée</th>
                <th className="text-left p-4 font-semibold text-gray-900">Niveau</th>
                <th className="text-left p-4 font-semibold text-gray-900">Statut</th>
                <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formations.map((formation) => (
                <tr key={formation.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-900 font-medium">{formation.title}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {subcategoryLabels[formation.subcategory]}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900">{formation.price}€</td>
                  <td className="p-4 text-gray-900">{formation.duration}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      formation.level === 'debutant' ? 'bg-green-100 text-green-800' :
                      formation.level === 'intermediaire' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {levelLabels[formation.level]}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(formation)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formation.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {formation.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(formation)}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(formation.id)}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {formations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune formation pour le moment
            </div>
          )}
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                    placeholder="Formation Ombré Brow"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                    placeholder="Apprenez la technique..."
                  />
                </div>

                {/* Prix et Durée */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Durée *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                      placeholder="2 jours"
                    />
                  </div>
                </div>

                {/* Sous-catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Sous-catégorie *
                  </label>
                  <select
                    required
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as 'cils' | 'levres' | 'sourcils' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  >
                    <option value="sourcils">Sourcils</option>
                    <option value="levres">Lèvres</option>
                    <option value="cils">Cils</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">
                    Détermine sur quelle page la formation apparaîtra
                  </p>
                </div>

                {/* Niveau */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Niveau *
                  </label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as 'debutant' | 'intermediaire' | 'avance' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                  >
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                  </select>
                </div>

                {/* ⭐ UPLOAD IMAGE */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Image de la formation
                  </label>
                  
                  {imagePreview && (
                    <div className="mb-3">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-900 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        <div className="text-gray-700">
                          {uploadingImage ? (
                            <span>⏳ Upload en cours...</span>
                          ) : (
                            <span>📷 Cliquer pour choisir une image</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Max 5MB - JPG, PNG, WEBP
                        </p>
                      </div>
                    </label>
                    
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({ ...formData, imageUrl: '' });
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Enregistrement...' : (editingFormation ? 'Modifier' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}