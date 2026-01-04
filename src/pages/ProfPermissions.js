import React, { useState } from 'react';
import ProfHeaderNav from '../components/ProfHeaderNav';
import Footer from '../components/Footer';

// Initial Data for Subjects and Permissions
const INITIAL_SUBJECTS = [
	{
		name: 'Machine Learning',
		code: '',
		status: 'Active',
	},
	{
		name: 'Artificial Intelligence',
		code: '',
		status: 'Active',
	},
	{
		name: 'Cryptography',
		code: '',
		status: 'Inactive',
	},
	{
		name: 'Quantum Machine Learning',
		code: '',
		status: 'Active',
	},
];

// Example initial permissions data
const PERMISSIONS = [
	{
		id: 1,
		subject: 'Machine Learning',
		canTakeAttendance: true,
		canViewAttendance: true,
		canEditAttendance: false,
	},
	{
		id: 4,
		subject: 'Quantum Machine Learning',
		canTakeAttendance: false,
		canViewAttendance: true,
		canEditAttendance: false,
	},
];

export default function PermissionManagementPage() {
	const [activeTab, setActiveTab] = useState('subjects');
	const [showModal, setShowModal] = useState(false);
	const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
	const [permissions, setPermissions] = useState([
		{
			subject: 'Machine Learning',
			date: '15/01/2024',
			timeWindow: '09:00 - 10:30',
			locationRequired: true,
		},
		{
			subject: 'Artificial Intelligence',
			date: '15/01/2024',
			timeWindow: '11:00 - 12:30',
			locationRequired: true,
		},
	]);

	// Toggle status for a single subject
	const handleToggleSubject = (idx) => {
		setSubjects((prev) =>
			prev.map((s, i) =>
				i === idx ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
			)
		);
	};

	const handleAddPermission = (newPermission) => {
		setPermissions((prev) => [...prev, newPermission]);
		setShowModal(false);
	};

	return (
		<div>
			<ProfHeaderNav />
			<div className="min-h-screen bg-gray-50 pt-2 px-2 md:px-8 flex flex-col">
				<div className="max-w-6xl mx-auto flex-1">
					{/* Page Header */}
					<div className="mb-6 text-left">
						<h1 className="text-3xl md:text-4xl font-bold">
							<span className="text-gray-900">Permission </span>
							<span className="text-emerald-600">Management</span>
						</h1>
						<div className="text-gray-500 text-base mt-2">Manage subjects and set attendance permissions for your classes</div>
					</div>
					<div className="w-full flex flex-col items-start">
						<div className="flex border-b border-gray-200 mb-8 justify-start w-full">
							<div className="flex">
								<button
									className={`px-6 py-2 font-semibold border-b-4 focus:outline-none flex items-center ${
										activeTab === 'subjects'
											? 'text-emerald-700 border-emerald-600 -mb-px'
											: 'text-gray-500 border-transparent hover:text-emerald-700'
									}`}
									style={{ minWidth: 160 }}
									onClick={() => setActiveTab('subjects')}
								>
									Subjects ({subjects.length})
								</button>
								<button
									className={`px-6 py-2 font-semibold border-b-4 focus:outline-none flex items-center ${
										activeTab === 'permissions'
											? 'text-emerald-700 border-emerald-600 -mb-px'
											: 'text-gray-500 border-transparent hover:text-emerald-700'
									}`}
									style={{ minWidth: 160 }}
									onClick={() => setActiveTab('permissions')}
								>
									Permissions ({permissions.length})
								</button>
							</div>
						</div>
					</div>
					{/* Panels */}
					{activeTab === 'subjects' ? (
						<>
							<SubjectsPanel subjects={subjects} onToggleSubject={handleToggleSubject} />
							<div className="h-16" />
						</>
					) : (
						<PermissionsPanel permissions={permissions} onAddPermission={() => setShowModal(true)} />
					)}
				</div>
				{showModal && <AddPermissionModal onClose={() => setShowModal(false)} onAdd={handleAddPermission} />}
				<Footer />
			</div>
		</div>
	);
}

function SubjectsPanel({ subjects, onToggleSubject }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{subjects.map((subject, idx) => (
				<SubjectCard key={idx} {...subject} onToggle={() => onToggleSubject(idx)} />
			))}
		</div>
	);
}

function SubjectCard({ name, code, status, onToggle }) {
	return (
		<div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
			<span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>{status}</span>
			<div className="font-bold text-lg mb-1">{name}</div>
			<div className="text-gray-400 text-sm mb-2">{code}</div>
			<button
				className={`mt-auto font-bold py-2 rounded w-full transition ${status === 'Active' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
				onClick={onToggle}
			>
				{status === 'Active' ? 'Deactivate' : 'Activate'}
			</button>
		</div>
	);
}

function PermissionCard({ subject, date, timeWindow, locationRequired }) {
	const [active, setActive] = useState(true);
	const [showEditOptions, setShowEditOptions] = useState(false);

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col relative">
			<span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-black'}`}>{active ? 'Active' : 'Inactive'}</span>
			<div className="font-bold text-lg mb-1">{subject}</div>
			<div className="text-gray-400 text-sm mb-2">Date: {date}</div>
			<div className="text-gray-400 text-sm mb-2">Time Window: {timeWindow}</div>
			<div className="text-gray-400 text-sm mb-2">Location Required: {locationRequired ? 'Yes' : 'No'}</div>
			<div className="flex gap-2 mt-auto">
				<button
					className={`font-bold py-2 rounded w-full transition ${active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
					onClick={() => setActive(!active)}
				>
					{active ? 'Deactivate' : 'Activate'}
				</button>
				<div className="relative">
					<button
						type="button"
						className="ml-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm border border-gray-200 transition"
						onClick={() => setShowEditOptions((v) => !v)}
					>
						<i className="bi bi-pencil" /> Edit
					</button>
					{showEditOptions && (
						<div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
							<button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setShowEditOptions(false); /* handle delete here */ }}>Delete</button>
							<button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => { setShowEditOptions(false); /* handle save here */ }}>Save</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function PermissionsPanel({ permissions, onAddPermission }) {
	return (
		<section className="bg-gray-50 px-0 md:px-2 py-2">
			{/* Section Header Row */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
				<h2 className="text-2xl font-bold text-gray-900 text-left">Attendance Permissions</h2>
				<button
					className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-4 py-2 text-sm font-semibold flex items-center gap-2 shadow-sm transition-all duration-200 w-full sm:w-auto justify-center"
					style={{ minWidth: '140px' }}
					onClick={onAddPermission}
				>
					<i className="bi bi-plus-lg" />
					<span className="truncate">Add Permission</span>
				</button>
			</div>
			{/* Permission Cards - grid layout */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{permissions.map((perm, idx) => (
					<PermissionCard
						key={idx}
						subject={perm.subject}
						date={perm.date}
						timeWindow={perm.timeWindow}
						locationRequired={perm.locationRequired}
					/>
				))}
			</div>
		</section>
	);
}

function AddSubjectButton({ onClick }) {
	return (
		<button onClick={onClick} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded shadow-sm transition">+ Add Subject</button>
	);
}

function AddPermissionButton({ onClick }) {
	return (
		<button onClick={onClick} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded shadow-sm transition text-sm">+ Add Permission</button>
	);
}

function AddPermissionModal({ onClose, onAdd }) {
	const [degree, setDegree] = useState('');
	const [subject, setSubject] = useState('');
	const [date, setDate] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [locationRequired, setLocationRequired] = useState(true);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!subject || !date || !startTime || !endTime) return;
		onAdd({
			subject,
			date,
			timeWindow: `${startTime} - ${endTime}`,
			locationRequired,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
			<div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 w-full max-w-md" style={{ minWidth: 320, maxWidth: 480 }}>
				<div className="mb-4">
					<h2 className="font-bold text-lg text-gray-900">Add Attendance Permission</h2>
				</div>
				<form className="space-y-4" onSubmit={handleSubmit}>
					{/* Degree Dropdown */}
					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1">Degree *</label>
						<select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" value={degree} onChange={e => setDegree(e.target.value)} required>
							<option value="" disabled>Select a degree…</option>
							<option value="BTech">BTech</option>
							<option value="MTech">MTech</option>
							<option value="MCA">MCA</option>
						</select>
					</div>
					{/* Subject Dropdown */}
					<div>
						<label className="block text-xs font-medium text-gray-500 mb-1">Subject *</label>
						<select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" value={subject} onChange={e => setSubject(e.target.value)} required>
							<option value="" disabled>Select a subject…</option>
							<option value="Machine Learning">Machine Learning</option>
							<option value="Artificial Intelligence">Artificial Intelligence</option>
							<option value="Quantum Machine Learning">Quantum Machine Learning</option>
							<option value="Cryptography">Cryptography</option>
						</select>
					</div>
					{/* Date Input */}
					<div className="relative w-full">
						<label className="block text-xs font-medium text-gray-500 mb-1">Date *</label>
						<input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" placeholder="dd-mm-yyyy" value={date} onChange={e => setDate(e.target.value)} required />
						<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none">
							<i className="bi bi-calendar" />
						</span>
					</div>
					{/* Time Row */}
					<div className="flex flex-col sm:flex-row gap-4 w-full">
						<div className="relative flex-1">
							<label className="block text-xs font-medium text-gray-500 mb-1">Start Time *</label>
							<input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" value={startTime} onChange={e => setStartTime(e.target.value)} required />
							<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none">
								<i className="bi bi-clock" />
							</span>
						</div>
						<div className="relative flex-1">
							<label className="block text-xs font-medium text-gray-500 mb-1">End Time *</label>
							<input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" value={endTime} onChange={e => setEndTime(e.target.value)} required />
							<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 pointer-events-none">
								<i className="bi bi-clock" />
							</span>
						</div>
					</div>
					{/* Checkbox */}
					<div className="flex items-center gap-2">
						<input type="checkbox" id="location-verification" className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" checked={locationRequired} onChange={e => setLocationRequired(e.target.checked)} />
						<label htmlFor="location-verification" className="text-xs text-gray-700">Require location verification</label>
					</div>
					{/* Footer Buttons */}
					<div className="flex gap-3 mt-6">
						<button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2 font-bold text-sm shadow">Add Permission</button>
						<button type="button" className="flex-1 bg-gray-200 text-gray-700 rounded-md py-2 font-semibold text-sm hover:bg-gray-300" onClick={onClose}>Cancel</button>
					</div>
				</form>
			</div>
		</div>
	);
}
