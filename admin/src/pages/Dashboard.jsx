import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications, deleteApplication, getCvDownloadUrl } from '../services/api';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationTable from '../components/applications/ApplicationTable';

export default function Dashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchApplications({
        type: filterType,
        status: filterStatus,
      });
      setApps(data);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, navigate]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  async function handleDelete(id) {
    if (!confirm('Delete this application?')) return;
    await deleteApplication(id);
    setApps((prev) => prev.filter((a) => a._id !== id));
  }

  function handleDownloadCv(id) {
    window.open(getCvDownloadUrl(id), '_blank');
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1B2A4A] mb-5">Applications</h2>

      <ApplicationFilters
        filterType={filterType}
        filterStatus={filterStatus}
        onTypeChange={setFilterType}
        onStatusChange={setFilterStatus}
      />

      {loading ? (
        <div className="text-center py-10 text-[#5A6A7A]">Loading...</div>
      ) : (
        <ApplicationTable
          applications={apps}
          onDownloadCv={handleDownloadCv}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
