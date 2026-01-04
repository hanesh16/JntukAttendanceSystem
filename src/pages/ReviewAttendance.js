import React, { useState, useMemo } from 'react';
import ProfHeaderNav from '../components/ProfHeaderNav';
import Footer from '../components/Footer';

const SUBJECTS = [
  'Machine Learning',
  'Artificial Intelligence',
  'Cryptography',
  'Quantum Machine Learning',
];
const STATUS_OPTIONS = ['All Status', 'Accepted', 'Rejected', 'Pending'];
const SUBJECT_OPTIONS = ['All Subjects', ...SUBJECTS];

const DUMMY_CARDS = [
  {
    name: 'Anitha',
    id: '24021DAI21',
    subject: 'Machine Learning',
    status: 'Accepted',
    location: 'jntuk pg block',
    date: '2025-12-29',
    time: '09:00',
  },
  {
    name: 'Saritha',
    id: '24021DAI15',
    subject: 'Artificial Intelligence',
    status: 'Pending',
    location: 'jntuk mech block',
    date: '2025-12-29',
    time: '09:00',
  },
  {
    name: 'Suresh',
    id: '24021DAI56',
    subject: 'Cryptography',
    status: 'Accepted',
    location: 'jntuk management block',
    date: '2025-12-29',
    time: '09:00',
  },
  {
    name: 'Bhargavi',
    id: '24021DAI78',
    subject: 'Quantum Machine Learning',
    status: 'Rejected',
    location: 'jntuk library',
    date: '2025-12-29',
    time: '09:00',
  },
];


export default function ReviewAttendance() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [status, setStatus] = useState('All Status');
  const [cards, setCards] = useState(DUMMY_CARDS);

  // Filtering logic
  const filtered = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch =
        !search ||
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.id.toLowerCase().includes(search.toLowerCase()) ||
        card.subject.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = subject === 'All Subjects' || card.subject === subject;
      const matchesStatus = status === 'All Status' || card.status === status;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [search, subject, status, cards]);

  // Approve/Reject logic
  const handleApprove = idx => {
    setCards(prev =>
      prev.map((c, i) =>
        i === idx ? { ...c, status: 'Accepted' } : c
      )
    );
  };
  const handleReject = idx => {
    setCards(prev =>
      prev.map((c, i) =>
        i === idx ? { ...c, status: 'Rejected' } : c
      )
    );
  };
  const handleApproveAll = () => {
    setCards(prev =>
      prev.map(c =>
        filtered.includes(c) && c.status === 'Pending'
          ? { ...c, status: 'Accepted' }
          : c
      )
    );
  };

  // Stat counts
  const total = cards.length;
  const pending = cards.filter(c => c.status === 'Pending').length;
  const accepted = cards.filter(c => c.status === 'Accepted').length;
  const rejected = cards.filter(c => c.status === 'Rejected').length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ProfHeaderNav />
      {/* Optionally, you can include ProfHeaderNav below if you want both navbars */}
      {/* <ProfHeaderNav /> */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10" style={{marginTop: '24px'}}> {/* marginTop to offset fixed header */}
        {/* Title Section */}
        <div className="mb-6 md:mb-10">
          <h1 className="font-extrabold text-2xl md:text-3xl">
            <span style={{ color: '#222' }}>Attendance </span>
            <span style={{ color: '#0F9D78' }}>Review</span>
          </h1>
          <div className="text-sm md:text-base text-gray-500 mt-1">Review and manage student attendance photo submissions</div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Submissions" value={total} />
          <StatCard label="Pending Review" value={pending} />
          <StatCard label="Approved" value={accepted} />
          <StatCard label="Rejected" value={rejected} />
        </div>

        {/* Submissions by Subject */}
        <div className="mb-8">
          <div className="font-bold text-lg md:text-xl mb-3">
            <span style={{ color: '#222' }}>Submissions by </span>
            <span style={{ color: '#0F9D78' }}>Subject</span>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUBJECTS.map(subj => (
                <div
                  key={subj}
                  className="bg-emerald-50 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all duration-200 subject-hover-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="font-bold text-base md:text-lg text-emerald-700 mb-1">{subj}</div>
                  <div className="text-xs text-gray-500">Submissions: {cards.filter(c => c.subject === subj).length}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center mb-8">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 text-sm md:flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="Search by student name, ID, or subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          >
            {SUBJECT_OPTIONS.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <button
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md px-5 py-2 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            onClick={handleApproveAll}
          >
            Approve All Visible
          </button>
        </div>

        {/* Submission Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((card, idx) => (
            <SubmissionCard
              key={card.id}
              card={card}
              onApprove={() => handleApprove(cards.indexOf(card))}
              onReject={() => handleReject(cards.indexOf(card))}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-10">No submissions found.</div>
          )}
        </div>
        {/* Add margin at the bottom so footer is not stuck to content */}
        <div style={{ height: '48px' }} />
      </main>
      <Footer />
      <style>{`
        .subject-hover-card:hover {
          transform: scale(1.07);
          box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.18), 0 1.5px 8px 0 rgba(16, 185, 129, 0.10);
          z-index: 1;
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col items-center justify-center text-center">
      <div className="text-2xl md:text-3xl font-extrabold text-emerald-700 mb-1">{value}</div>
      <div className="text-xs md:text-sm text-gray-500 font-semibold">{label}</div>
    </div>
  );
}

function SubmissionCard({ card, onApprove, onReject }) {
  const statusColor =
    card.status === 'Accepted'
      ? 'bg-emerald-100 text-emerald-700'
      : card.status === 'Pending'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <div className="font-bold text-base md:text-lg text-gray-900">{card.name}</div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>{card.status}</span>
      </div>
      <div className="text-xs text-gray-500 mb-1">ID: {card.id}</div>
      <div className="text-sm text-gray-700 mb-1">{card.subject}</div>
      <div className="text-xs text-gray-500 mb-1">{card.date} {card.time}</div>
      <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
        <span className="inline-block align-middle"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg></span>
        {card.location}
      </div>
      <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-2">
        <span className="text-gray-400">[Photo Placeholder]</span>
      </div>
      {card.status === 'Pending' ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md py-2 transition-all duration-200"
            style={{ minHeight: 44 }}
            onClick={onApprove}
          >
            Approve
          </button>
          <button
            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-md py-2 transition-all duration-200"
            style={{ minHeight: 44 }}
            onClick={onReject}
          >
            Reject
          </button>
        </div>
      ) : card.status === 'Rejected' ? (
        <div className="text-xs text-red-600 font-semibold mt-2">Photo unclear, please resubmit</div>
      ) : null}
    </div>
  );
}
