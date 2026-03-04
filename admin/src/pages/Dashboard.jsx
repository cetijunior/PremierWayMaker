import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications, deleteApplication, getCvDownloadUrl } from '../services/api';
import { SEED_APPLICATIONS } from '../data/seedApplications';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationTable from '../components/applications/ApplicationTable';

export default function Dashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [useSeedData, setUseSeedData] = useState(false);

  const filteredSeed = useMemo(() => {
    return SEED_APPLICATIONS.filter((a) => {
      if (filterType && a.type !== filterType) return false;
      if (filterStatus && a.paymentStatus !== filterStatus) return false;
      return true;
    });
  }, [filterType, filterStatus]);

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchApplications({
        type: filterType,
        status: filterStatus,
      });
      setApps(data);
      setUseSeedData(false);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/login');
      } else {
        // API unavailable (e.g. demo deployment) – use seed data
        setUseSeedData(true);
        setApps(filteredSeed);
      }
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, navigate, filteredSeed]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  async function handleDelete(id) {
    if (!confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
    } catch {
      // Ignore when API unavailable (demo mode)
    }
    setApps((prev) => prev.filter((a) => a._id !== id));
  }

  function handleDownloadCv(id) {
    if (useSeedData) return; // No real CV in demo
    window.open(getCvDownloadUrl(id), '_blank');
  }

  return (
    <div className="min-w-0">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A4A] mb-4 sm:mb-5">Applications</h2>

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
          isDemo={useSeedData}
        />
      )}
    </div>
  );
}
