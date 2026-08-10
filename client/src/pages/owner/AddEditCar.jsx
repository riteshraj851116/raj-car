import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import './AddEditCar.css';

export const AddEditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loadingCar, setLoadingCar] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState('Sedan');
  const [pricePerDay, setPricePerDay] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [seatingCapacity, setSeatingCapacity] = useState(5);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      const fetchCarDetails = async () => {
        try {
          const res = await api.get(`/cars/${id}`);
          const c = res.data;
          setBrand(c.brand || '');
          setModel(c.model || '');
          setYear(c.year || new Date().getFullYear());
          setCategory(c.category || 'Sedan');
          setPricePerDay(c.pricePerDay || '');
          setFuelType(c.fuel_type || 'Petrol');
          setTransmission(c.transmission || 'Automatic');
          setSeatingCapacity(c.seating_capacity || 5);
          setLocation(c.location || '');
          setDescription(c.description || '');
          setImage(c.image || '');
        } catch (err) {
          toast.error(err.userMessage || 'Failed to load car details');
          navigate('/owner/cars');
        } finally {
          setLoadingCar(false);
        }
      };
      fetchCarDetails();
    }
  }, [id, isEditMode, navigate]);

  // Handle Image File Upload (ImageKit Integration / Local base64)
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const res = await api.post('/upload', {
          image: base64Data,
          fileName: file.name,
        });
        setImage(res.data.url);
        toast.success('Image uploaded successfully via ImageKit!');
      } catch (err) {
        // Fallback to local base64 preview
        setImage(base64Data);
        toast.success('Image attached successfully!');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brand || !model || !pricePerDay || !location || !description) {
      toast.error('Please fill in all required car information');
      return;
    }

    if (!image) {
      toast.error('Please provide a car photo URL or upload an image');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        brand,
        model,
        year: Number(year),
        category,
        pricePerDay: Number(pricePerDay),
        fuel_type: fuelType,
        transmission,
        seating_capacity: Number(seatingCapacity),
        location,
        description,
        image,
      };

      if (isEditMode && id) {
        await api.put(`/cars/${id}`, payload);
        toast.success('Car details updated successfully!');
      } else {
        await api.post('/cars', payload);
        toast.success('New vehicle added to your fleet!');
      }

      navigate('/owner/cars');
    } catch (err) {
      toast.error(err.userMessage || 'Failed to save car details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCar) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading car information...</p>
      </div>
    );
  }

  return (
    <div className="add-car-page">
      <div className="container">
        <Link to="/owner/cars" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Fleet Cars
        </Link>

        <div className="add-car-card">
          <div className="add-car-header">
            <h1 className="add-car-title">{isEditMode ? 'Edit Fleet Car' : 'Add New Vehicle to Fleet'}</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Fill out vehicle specifications, pricing, and high-quality photo.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Brand / Make *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Toyota, BMW, Tesla"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Model Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Camry, M4, Model 3"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Year *</label>
                <input
                  type="number"
                  className="form-input"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Sports">Sports</option>
                  <option value="Electric">Electric</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price Per Day ($) *</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  placeholder="95"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Fuel Type</label>
                <select className="form-select" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transmission</label>
                <select className="form-select" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Seating Capacity</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="12"
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pickup Location City/Address *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description & Key Features *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe performance, audio system, interior trim, and rental policies..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Car Photo (ImageKit Upload or Image URL)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{ flex: 1 }}
                />
                <label className="btn btn-outline" style={{ margin: 0, cursor: 'pointer' }}>
                  <Upload size={16} />
                  {uploadingImage ? 'Uploading...' : 'Upload File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              {image ? (
                <div className="image-preview-container">
                  <img src={image} alt="Car Preview" className="image-preview" />
                </div>
              ) : (
                <div className="image-preview-container" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <ImageIcon size={24} style={{ marginRight: '8px' }} /> Photo preview will display here
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                disabled={submitting || uploadingImage}
              >
                {submitting ? 'Saving Car...' : isEditMode ? 'Update Vehicle' : 'Add Vehicle to Fleet'}
              </button>
              <Link to="/owner/cars" className="btn btn-outline btn-lg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
