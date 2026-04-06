import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications, deleteApplication, getCvDownloadUrl } from '../services/api';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationTable from '../components/applications/ApplicationTable';
import { HiOutlineUserGroup, HiOutlineGlobeAlt, HiOutlineCurrencyEuro } from 'react-icons/hi2';

export default function Dashboard() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [error, setError] = useState('');
  const [deletingIds, setDeletingIds] = useState([]);

  const hasFilters = useMemo(() => {
    return Boolean(filterType || filterStatus || filterProvider);
  }, [filterType, filterStatus, filterProvider]);

  const loadApps = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchApplications({
        type: filterType,
        status: filterStatus,
        provider: filterProvider,
      });
      setApps(data);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, filterProvider, navigate]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  async function handleDelete(id) {
    if (!confirm('Delete this application?')) return;
    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteApplication(id);
      setApps((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete application');
    } finally {
      setDeletingIds((prev) => prev.filter((currId) => currId !== id));
    }
  }

  function handleDownloadCv(id) {
    window.open(getCvDownloadUrl(id), '_blank');
  }

  function clearFilters() {
    setFilterType('');
    setFilterStatus('');
    setFilterProvider('');
  }

  const metrics = useMemo(() => {
    const total = apps.length;
    const revenue = apps.filter(a => a.paymentStatus === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const outside = apps.filter(a => a.type === 'outside').length;
    return [
      { label: 'Total Applications', value: total, icon: HiOutlineUserGroup, color: 'text-blue-600', bg: 'bg-blue-100' },
      { label: 'Total Revenue', value: `€${revenue}`, icon: HiOutlineCurrencyEuro, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      { label: 'Outside Applicants', value: outside, icon: HiOutlineGlobeAlt, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];
  }, [apps]);

  return (
    <div className="min-w-0 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Overview Dashboard</h2>
        <p className="text-slate-500 mt-1">Manage and track your applicant submissions effectively.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg} ${metric.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-lg text-slate-800">Applications List</h3>
          <ApplicationFilters
            filterType={filterType}
            filterStatus={filterStatus}
            filterProvider={filterProvider}
            onTypeChange={setFilterType}
            onStatusChange={setFilterStatus}
            onProviderChange={setFilterProvider}
            onClear={clearFilters}
            hasFilters={hasFilters}
          />
        </div>

        {error && (
          <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadApps}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium tracking-wide">Loading applications...</p>
          </div>
        ) : (
          <div className="p-0">
            <ApplicationTable
              applications={apps}
              onDownloadCv={handleDownloadCv}
              onDelete={handleDelete}
              deletingIds={deletingIds}
            />
          </div>
        )}
      </div>
    </div>
  );
}
