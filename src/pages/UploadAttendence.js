import React, { useMemo, useRef, useState } from 'react';
import StudentFooter from '../components/StudentFooter';

const BRAND_GREEN = '#0F9D78';
const BRAND_GREEN_DARK = '#0B7A5E';

export default function UploadAttendence() {
  const [regNo, setRegNo] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedClassKey, setSelectedClassKey] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const cameraInputRef = useRef(null);

  const days = useMemo(
    () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    []
  );

  const yearOptions = useMemo(() => {
    if (program === 'MTech') return ['I', 'II'];
    if (program === 'Btech') return ['I', 'II', 'III', 'IV'];
    return [];
  }, [program]);

  const scheduleByDay = useMemo(
    () => ({
      Monday: [
        { name: 'Machine Learning Lab', time: '09:00 AM - 12:15 PM', professor: 'DR. Sumalatha', active: true },
        { name: 'Computer Vision', time: '02:00 PM - 03:15 PM', professor: 'DR. Samatha', active: true },
        { name: 'Project', time: '03:30 PM - 05:00 PM', professor: '—', active: true },
      ],
      Tuesday: [
        { name: 'Deep Learning', time: '09:00 AM - 12:15 PM', professor: 'DR. Ushodaya', active: true },
        { name: 'Reinforcement Learning', time: '02:00 PM - 03:15 PM', professor: 'DR. Sundarleela', active: true },
        { name: 'Computer Vision', time: '03:30 PM - 05:00 PM', professor: 'DR. Samatha', active: true },
      ],
      Wednesday: [
        { name: 'Deep Learning', time: '11:00 AM - 12:15 PM', professor: 'DR. Ushodaya', active: true },
        { name: 'Project', time: '02:00 PM - 05:00 PM', professor: '—', active: true },
      ],
      Thursday: [
        { name: 'Deep Learning', time: '09:00 AM - 10:15 AM', professor: 'DR. Ushodaya', active: true },
        { name: 'Machine Learning', time: '11:00 AM - 12:15 PM', professor: 'DR. Sumalatha', active: true },
      ],
      Friday: [
        { name: 'Constitution of India', time: '09:00 AM - 10:15 AM', professor: 'DR. Lovakumari', active: true },
        { name: 'Machine Learning', time: '10:30 AM - 12:15 PM', professor: 'DR. Sumalatha', active: true },
      ],
      Saturday: [],
    }),
    []
  );

  const isTimetableForMtechYear1 = program === 'MTech' && year === 'I';
  const classes = isTimetableForMtechYear1 ? (scheduleByDay[selectedDay] || []) : [];
  const isHoliday = selectedDay === 'Saturday';
  const showUploadBox = !isHoliday && isTimetableForMtechYear1 && Boolean(selectedClassKey);

  const isReadyForClasses =
    regNo.trim().length > 0 &&
    Boolean(program) &&
    Boolean(year) &&
    Boolean(selectedDay);

  const canOpenTimetable = isReadyForClasses;

  return (
    <>
      <div className="min-h-screen bg-[#f8faf5] px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Upload card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Choose Degree</h2>
            </div>

            {/* Details box */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-white mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Reg No</label>
                  <textarea
                    rows={1}
                    value={regNo}
                    onChange={(e) => {
                      setRegNo(e.target.value);
                      setIsTimetableOpen(false);
                      setSelectedClassKey('');
                      setSelectedClassName('');
                      setUploadedFileName('');
                    }}
                    placeholder="Enter registration number"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Program</label>
                  <select
                    value={program}
                    onChange={(e) => {
                      const nextProgram = e.target.value;
                      setProgram(nextProgram);
                      setYear('');
                      setIsTimetableOpen(false);
                      setSelectedDay('');
                      setSelectedClassKey('');
                      setSelectedClassName('');
                      setUploadedFileName('');
                    }}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                  >
                    <option value="" disabled>Choose</option>
                    <option value="Btech">Btech</option>
                    <option value="MTech">MTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Year</label>
                  <select
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      setIsTimetableOpen(false);
                      setSelectedDay('');
                      setSelectedClassKey('');
                      setSelectedClassName('');
                      setUploadedFileName('');
                    }}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                  >
                    <option value="" disabled>Choose</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Select</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => {
                  const selected = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      className={
                        selected
                          ? 'px-4 py-2 rounded-full text-sm font-semibold text-white'
                          : 'px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      style={selected ? { backgroundColor: BRAND_GREEN } : undefined}
                      onClick={() => {
                        setSelectedDay(day);
                        setSelectedClassKey('');
                        setSelectedClassName('');
                        setIsTimetableOpen(false);
                        setUploadedFileName('');
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="btn w-full h-12 rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: 'white', borderColor: BRAND_GREEN, color: BRAND_GREEN }}
                  disabled={!canOpenTimetable}
                  onMouseEnter={(e) => {
                    if (e.currentTarget.disabled) return;
                    e.currentTarget.style.backgroundColor = BRAND_GREEN;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = BRAND_GREEN;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = BRAND_GREEN;
                    e.currentTarget.style.borderColor = BRAND_GREEN;
                  }}
                  onClick={() => {
                    if (!canOpenTimetable) return;
                    setIsTimetableOpen(true);
                  }}
                >
                  Open
                </button>
              </div>
            </div>
          </div>

          {/* Right: Today's classes (only after all details are filled) */}
          {isReadyForClasses && isTimetableOpen ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">Today’s Timetable</h2>
                <span className="text-sm text-gray-600">{selectedDay}</span>
              </div>

              {isHoliday ? (
                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-600">
                      <i className="bi bi-moon-stars" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">Holiday</div>
                        <div className="text-sm text-gray-600">Saturday is a holiday.</div>
                    </div>
                  </div>
                </div>
              ) : !isTimetableForMtechYear1 ? (
                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-600">
                      <i className="bi bi-info-circle" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">Timetable Not Available</div>
                      <div className="text-sm text-gray-600">This timetable is only for MTech I year.</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {classes.map((c) => (
                    <button
                      key={`${c.name}-${c.time}`}
                      type="button"
                      className={
                        selectedClassKey === `${c.name}-${c.time}`
                          ? 'w-full text-left border rounded-2xl p-4 transition-colors bg-emerald-50 border-emerald-200'
                          : 'w-full text-left border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors'
                      }
                      onClick={() => {
                        setSelectedClassKey(`${c.name}-${c.time}`);
                        setSelectedClassName(c.name);
                        setUploadedFileName('');
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">{c.name}</h3>
                            {c.active ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                Active
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{c.time}</p>
                          <p className="text-sm text-gray-600">{c.professor}</p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500">
                          <i className="bi bi-chevron-right" aria-hidden="true" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Upload photo box (below Today's Classes) */}
              {showUploadBox ? (
                <div className="mt-6 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">Upload Attendance</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Submit today’s {selectedClassName || 'class'} attendance
                  </p>
                </div>

                <div className="mt-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <i className="bi bi-camera text-2xl text-gray-600" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-gray-900 font-semibold">Take a photo or upload from gallery</p>
                  <p className="mt-1 text-sm text-gray-600">Supported: JPG, PNG</p>
                  {uploadedFileName ? (
                    <p className="mt-2 text-sm text-gray-700">
                      Selected: <span className="font-semibold">{uploadedFileName}</span>
                    </p>
                  ) : null}

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute opacity-0 w-px h-px overflow-hidden"
                    style={{ left: '-9999px' }}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      setUploadedFileName(file ? file.name : '');
                    }}
                  />
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      className="btn text-white rounded-xl px-4 py-2 w-full sm:w-auto"
                      style={{ backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN }}
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <i className="bi bi-camera-fill me-2" aria-hidden="true" />
                      Take Photo
                    </button>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="btn w-full h-12 text-white rounded-xl font-semibold transition-colors"
                      style={{ backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = BRAND_GREEN_DARK;
                        e.currentTarget.style.borderColor = BRAND_GREEN_DARK;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = BRAND_GREEN;
                        e.currentTarget.style.borderColor = BRAND_GREEN;
                      }}
                    >
                      Submit Attendance
                    </button>
                  </div>

                </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <StudentFooter />
    </>
  );
}
