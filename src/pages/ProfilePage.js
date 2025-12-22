import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getUserProfile, getUserProfileRTDB, hasRTDB, upsertUserProfile, upsertUserProfileRTDB } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';
import { createSignedUrlForObject, getSupabaseJwtFromFirebaseUser, uploadProfileImageToSupabasePrivate } from '../supabase';

const DISCIPLINES_BY_DEGREE = {
  BTech: ['CSE', 'Cyber security', 'AIML', 'AIDS'],
  MTech: ['CSE', 'Cybersecurity', 'AIML']
};

export default function ProfilePage() {
  const { user, profile, refreshProfile } = React.useContext(AuthContext);

  const withTimeout = React.useCallback((promise, ms, message) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
    ]);
  }, []);

  const [pageMode, setPageMode] = React.useState('edit'); // 'edit' | 'view'
  const [savedProfile, setSavedProfile] = React.useState(null);

  const photoInputRef = React.useRef(null);
  const [studentPhotoFile, setStudentPhotoFile] = React.useState(null);
  const [studentPhotoPreviewUrl, setStudentPhotoPreviewUrl] = React.useState('');
  const [photoError, setPhotoError] = React.useState('');
  const [photoStatus, setPhotoStatus] = React.useState('');

  const [supabaseJwt, setSupabaseJwt] = React.useState('');

  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState('');
  const [saveError, setSaveError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [existingCreatedAt, setExistingCreatedAt] = React.useState(null);

  const [studentInfo, setStudentInfo] = React.useState({
    firstName: '',
    secondName: '',
    phoneNumber: '',
    degree: '',
    discipline: '',
    yearFrom: '',
    yearTo: ''
  });

  const [personalInfo, setPersonalInfo] = React.useState({
    fatherName: '',
    fatherPhoneNumber: '',
    motherName: '',
    motherPhoneNumber: '',
    aadhaarNumber: '',
    bloodGroup: '',
    address: ''
  });

  const disciplineOptions = React.useMemo(
    () => DISCIPLINES_BY_DEGREE[studentInfo.degree] || [],
    [studentInfo.degree]
  );

  React.useEffect(() => {
    if (!studentInfo.discipline) return;
    if (!disciplineOptions.includes(studentInfo.discipline)) {
      setStudentInfo((prev) => ({ ...prev, discipline: '' }));
    }
  }, [studentInfo.degree, studentInfo.discipline, disciplineOptions]);

  React.useEffect(() => {
    if (!studentPhotoFile) {
      setStudentPhotoPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(studentPhotoFile);
    setStudentPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [studentPhotoFile]);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!user) return;
      try {
        // Prefer RTDB if configured (so data appears in Realtime Database console)
        const p = (hasRTDB ? await getUserProfileRTDB(user.uid) : null) ?? profile ?? (await getUserProfile(user.uid));
        if (cancelled || !p) return;

        setStudentInfo((prev) => ({
          ...prev,
          firstName: p.firstName || '',
          secondName: p.secondName || '',
          phoneNumber: p.phoneNumber || '',
          degree: p.degree || '',
          discipline: p.discipline || '',
          yearFrom: p.yearFrom ? String(p.yearFrom) : '',
          yearTo: p.yearTo ? String(p.yearTo) : ''
        }));

        setPersonalInfo((prev) => ({
          ...prev,
          fatherName: p.fatherName || '',
          fatherPhoneNumber: p.fatherPhoneNumber || '',
          motherName: p.motherName || '',
          motherPhoneNumber: p.motherPhoneNumber || '',
          aadhaarNumber: p.aadhaarNumber || '',
          bloodGroup: p.bloodGroup || '',
          address: p.address || ''
        }));

        if (p.photoURL) {
          setStudentPhotoPreviewUrl(p.photoURL);
          setStudentPhotoFile(null);
        }

        // If using private Supabase buckets, refresh a signed URL when we have a stored objectPath.
        if (p.photoBucket && p.photoObjectPath) {
          try {
            const jwt = supabaseJwt || (await getSupabaseJwtFromFirebaseUser(user));
            if (!cancelled && !supabaseJwt) setSupabaseJwt(jwt);
            const signedUrl = await createSignedUrlForObject({
              bucket: p.photoBucket,
              objectPath: p.photoObjectPath,
              supabaseJwt: jwt,
              expiresInSeconds: 60 * 60 * 24
            });
            if (!cancelled && signedUrl) {
              setStudentPhotoPreviewUrl(signedUrl);
            }
          } catch {
            // ignore; profile can still load without image
          }
        }

        setExistingCreatedAt(p.createdAt || null);

        // If profile exists, show saved view by default.
        setSavedProfile(p);
        setPageMode('view');
      } catch (err) {
        // Non-fatal; user can still fill and save
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user, profile, supabaseJwt]);

  const setField = (name) => (e) => {
    const value = e.target.value;
    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setStudentInfo((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const setPersonalField = (name) => (e) => {
    const value = e.target.value;
    if (name === 'fatherPhoneNumber' || name === 'motherPhoneNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setPersonalInfo((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    if (name === 'aadhaarNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
      setPersonalInfo((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const setDegree = (e) => {
    const degree = e.target.value;
    setStudentInfo((prev) => ({ ...prev, degree }));
  };

  const onPickStudentPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPhotoError('');
    setPhotoStatus('');

    const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    const type = (file.type || '').toLowerCase();
    if (!allowedTypes.has(type)) {
      setPhotoError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (typeof file.size === 'number' && file.size > maxBytes) {
      setPhotoError('Image too large. Max size is 2MB.');
      return;
    }
    setStudentPhotoFile(file);
    setPhotoStatus('Ready to upload');
  };

  const validate = () => {
    const errors = {};
    const required = (key, value, label) => {
      if (!String(value || '').trim()) errors[key] = `${label} is required`;
    };

    required('firstName', studentInfo.firstName, 'First Name');
    required('secondName', studentInfo.secondName, 'Second Name');
    required('phoneNumber', studentInfo.phoneNumber, 'Phone Number');
    if (studentInfo.phoneNumber && String(studentInfo.phoneNumber).length !== 10) {
      errors.phoneNumber = 'Phone Number must be 10 digits';
    }
    required('degree', studentInfo.degree, 'Degree');
    required('discipline', studentInfo.discipline, 'Discipline');

    required('yearFrom', studentInfo.yearFrom, 'Year From');
    required('yearTo', studentInfo.yearTo, 'Year To');
    const yf = Number(studentInfo.yearFrom);
    const yt = Number(studentInfo.yearTo);
    if (studentInfo.yearFrom && String(studentInfo.yearFrom).length !== 4) errors.yearFrom = 'Year From must be 4 digits';
    if (studentInfo.yearTo && String(studentInfo.yearTo).length !== 4) errors.yearTo = 'Year To must be 4 digits';
    if (String(studentInfo.yearFrom).length === 4 && (yf < 2020 || yf > 2050)) errors.yearFrom = 'Year From must be between 2020 and 2050';
    if (String(studentInfo.yearTo).length === 4 && (yt < 2020 || yt > 2050)) errors.yearTo = 'Year To must be between 2020 and 2050';
    if (String(studentInfo.yearFrom).length === 4 && String(studentInfo.yearTo).length === 4 && yf > yt) {
      errors.yearTo = 'Year To must be greater than or equal to Year From';
    }

    required('fatherName', personalInfo.fatherName, 'Father Name');
    required('fatherPhoneNumber', personalInfo.fatherPhoneNumber, 'Father Phone Number');
    if (personalInfo.fatherPhoneNumber && String(personalInfo.fatherPhoneNumber).length !== 10) {
      errors.fatherPhoneNumber = 'Father Phone Number must be 10 digits';
    }
    required('motherName', personalInfo.motherName, 'Mother Name');
    required('motherPhoneNumber', personalInfo.motherPhoneNumber, 'Mother Phone Number');
    if (personalInfo.motherPhoneNumber && String(personalInfo.motherPhoneNumber).length !== 10) {
      errors.motherPhoneNumber = 'Mother Phone Number must be 10 digits';
    }
    required('aadhaarNumber', personalInfo.aadhaarNumber, 'Aadhaar Number');
    if (personalInfo.aadhaarNumber && String(personalInfo.aadhaarNumber).length !== 12) {
      errors.aadhaarNumber = 'Aadhaar Number must be 12 digits';
    }
    required('bloodGroup', personalInfo.bloodGroup, 'Blood Group');
    required('address', personalInfo.address, 'Address');

    return errors;
  };

  const handleSaveInformation = async () => {
    setSaveSuccess('');
    setSaveError('');
    setPhotoStatus('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setSaveError('Please fix the highlighted errors.');
      return;
    }
    if (!user) {
      setSaveError('You must be signed in to save your profile.');
      return;
    }

    setSaving(true);
    try {
      const uid = user.uid;
      const supabasePhotoPath = `profile-images/${uid}/profile.jpg`;

      let photoURL = (profile && profile.photoURL) || '';
      let photoBucket = (profile && profile.photoBucket) || '';
      let photoObjectPath = (profile && profile.photoObjectPath) || '';
      if (studentPhotoFile) {
        try {
          setPhotoStatus('Uploading image...');
          const jwt = supabaseJwt || (await getSupabaseJwtFromFirebaseUser(user));
          if (!supabaseJwt) setSupabaseJwt(jwt);

          const uploaded = await withTimeout(
            uploadProfileImageToSupabasePrivate({ firebaseUid: uid, file: studentPhotoFile, supabaseJwt: jwt }),
            30000,
            'Profile image upload timed out. Please try again.'
          );
          photoURL = uploaded.photoURL;
          photoBucket = uploaded.photoBucket;
          photoObjectPath = uploaded.photoObjectPath;
          setPhotoStatus('Image uploaded');
        } catch (err) {
          // Photo upload is optional: do not block saving profile fields.
          // Revert preview back to the last saved photo (or empty) so the UI doesn't imply it was saved.
          const rawMsg = err?.message || 'Profile photo upload failed.';
          const msg = String(rawMsg).includes('Invalid Firebase ID token')
            ? `${rawMsg}. Please sign out and sign in again. If this keeps happening, ensure the token server is using Firebase Admin credentials from the same Firebase project.`
            : rawMsg;
          setPhotoError(msg);
          setPhotoStatus('Image upload failed');
          setStudentPhotoFile(null);
          setStudentPhotoPreviewUrl(photoURL || '');
        }
      }

      const payload = {
        firstName: studentInfo.firstName.trim(),
        secondName: studentInfo.secondName.trim(),
        phoneNumber: String(studentInfo.phoneNumber),
        degree: studentInfo.degree,
        discipline: studentInfo.discipline,
        yearFrom: String(studentInfo.yearFrom),
        yearTo: String(studentInfo.yearTo),

        fatherName: personalInfo.fatherName.trim(),
        fatherPhoneNumber: String(personalInfo.fatherPhoneNumber),
        motherName: personalInfo.motherName.trim(),
        motherPhoneNumber: String(personalInfo.motherPhoneNumber),

        aadhaarNumber: String(personalInfo.aadhaarNumber),
        aadhaarLast4: String(personalInfo.aadhaarNumber).slice(-4),
        bloodGroup: personalInfo.bloodGroup,
        address: personalInfo.address.trim(),

        role: (profile && profile.role) || 'student',
        email: user.email || (profile && profile.email) || null,

        updatedAt: serverTimestamp()
      };

      if (!existingCreatedAt) {
        payload.createdAt = serverTimestamp();
      }

      if (photoURL) {
        payload.photoURL = photoURL;
        payload.photoPath = supabasePhotoPath;
        if (photoBucket && photoObjectPath) {
          payload.photoBucket = photoBucket;
          payload.photoObjectPath = photoObjectPath;
        }
      }

      await withTimeout(
        upsertUserProfile(uid, payload),
        15000,
        'Save timed out. Check your internet connection and Firestore rules, then try again.'
      );

      // At this point, Firestore save succeeded.
      setSaveSuccess('Saved successfully');

      // Show saved data immediately (even if re-fetch is slow) and switch to view mode shortly after
      // so the user can see the "Saved successfully" state before the form disappears.
      setSavedProfile({ uid, ...payload });
      setTimeout(() => setPageMode('view'), 1200);

      // Also store the same data in Realtime Database (users/{uid}) when configured
      if (hasRTDB) {
        const payloadRTDB = {
          firstName: payload.firstName,
          secondName: payload.secondName,
          phoneNumber: payload.phoneNumber,
          degree: payload.degree,
          discipline: payload.discipline,
          yearFrom: payload.yearFrom,
          yearTo: payload.yearTo,
          fatherName: payload.fatherName,
          fatherPhoneNumber: payload.fatherPhoneNumber,
          motherName: payload.motherName,
          motherPhoneNumber: payload.motherPhoneNumber,
          aadhaarNumber: payload.aadhaarNumber,
          aadhaarLast4: payload.aadhaarLast4,
          bloodGroup: payload.bloodGroup,
          address: payload.address,
          role: payload.role,
          email: payload.email,
          photoURL: payload.photoURL || '',
          photoPath: payload.photoPath || '',
          photoBucket: payload.photoBucket || '',
          photoObjectPath: payload.photoObjectPath || ''
        };

        try {
          await withTimeout(
            upsertUserProfileRTDB(uid, payloadRTDB),
            15000,
            'Realtime Database save timed out. Check your internet connection and RTDB rules.'
          );
        } catch (err) {
          setSaveError(
            `Saved to Firestore, but failed to save to Realtime Database: ${err?.message || 'Unknown error'}`
          );
        }
      }

      // Refresh is helpful, but should not block the UI.
      try {
        await withTimeout(
          refreshProfile(),
          8000,
          'Profile refresh timed out. Your data is saved; please reload the page to see the latest values.'
        );
      } catch {
        // ignore
      }
      setExistingCreatedAt(existingCreatedAt || true);

      // Re-fetch latest saved record so developer/user can confirm persistence.
      let latest = null;
      try {
        latest = await withTimeout(
          (async () => (hasRTDB ? await getUserProfileRTDB(uid) : null) ?? (await getUserProfile(uid)))(),
          8000,
          'Fetching latest saved data timed out. Your data is saved; please reload the page.'
        );
      } catch {
        latest = null;
      }
      if (latest) {
        setSavedProfile(latest);
        setFieldErrors({});
        if (latest.photoURL) {
          setStudentPhotoPreviewUrl(latest.photoURL);
          setStudentPhotoFile(null);
        }
      }
    } catch (err) {
      setSaveError(err?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const toDisplay = (value) => {
    const text = value === null || value === undefined ? '' : String(value);
    return text.trim() ? text : '-';
  };

  const canEdit = pageMode === 'edit';

  const ValueBox = ({ value }) => (
    <div className="w-full px-4 py-3 border border-emerald-200 rounded-lg bg-white text-emerald-900">
      {toDisplay(value)}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f8faf5] p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="bg-[#C1E1C1]/75 rounded-none p-8 shadow-lg border-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-emerald-800">Student information</h2>
              {!canEdit ? (
                <button
                  type="button"
                  onClick={() => {
                    setSaveSuccess('');
                    setSaveError('');
                    setPageMode('edit');
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-emerald-200 bg-white text-emerald-800 font-semibold hover:bg-emerald-50"
                >
                  Edit
                </button>
              ) : null}
            </div>

            <div className="mt-6 flex justify-center">
              <div className="flex flex-col items-center">
                <button
                type="button"
                onClick={() => {
                  if (!canEdit) return;
                  if (photoInputRef.current) photoInputRef.current.click();
                }}
                disabled={!canEdit}
                className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-[#2E8B57] rounded-lg bg-white overflow-hidden flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {studentPhotoPreviewUrl ? (
                  <img
                    src={studentPhotoPreviewUrl}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-emerald-800 text-center px-2">
                    Add Photo
                  </span>
                )}
                </button>
              <input
                ref={photoInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={canEdit ? onPickStudentPhoto : undefined}
              />
                <p className="mt-2 text-xs text-emerald-700">JPG/PNG/WEBP • Max 2MB</p>
                {photoStatus ? (
                  <p className="mt-1 text-xs font-semibold text-emerald-800">{photoStatus}</p>
                ) : null}
                {photoError ? (
                  <p className="mt-1 text-xs text-red-600">{photoError}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">First Name</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={studentInfo.firstName}
                    onChange={setField('firstName')}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter first name"
                  />
                ) : (
                  <ValueBox value={savedProfile?.firstName ?? studentInfo.firstName} />
                )}
                {fieldErrors.firstName ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.firstName}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Second Name</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={studentInfo.secondName}
                    onChange={setField('secondName')}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter second name"
                  />
                ) : (
                  <ValueBox value={savedProfile?.secondName ?? studentInfo.secondName} />
                )}
                {fieldErrors.secondName ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.secondName}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Phone Number</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={studentInfo.phoneNumber}
                    onChange={setField('phoneNumber')}
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <ValueBox value={savedProfile?.phoneNumber ?? studentInfo.phoneNumber} />
                )}
                {fieldErrors.phoneNumber ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.phoneNumber}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Degree</label>
                {canEdit ? (
                  <select
                    value={studentInfo.degree}
                    onChange={setDegree}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" disabled>Select Degree</option>
                    <option value="BTech">BTech</option>
                    <option value="MTech">MTech</option>
                  </select>
                ) : (
                  <ValueBox value={savedProfile?.degree ?? studentInfo.degree} />
                )}
                {fieldErrors.degree ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.degree}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Discipline</label>
                {canEdit ? (
                  <select
                    value={studentInfo.discipline}
                    onChange={setField('discipline')}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={!studentInfo.degree}
                  >
                    <option value="" disabled>{studentInfo.degree ? 'Select discipline' : 'Select Degree first'}</option>
                    {disciplineOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <ValueBox value={savedProfile?.discipline ?? studentInfo.discipline} />
                )}
                {fieldErrors.discipline ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.discipline}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Year</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-800 mb-1">From</label>
                    {canEdit ? (
                      <select
                        value={studentInfo.yearFrom}
                        onChange={setField('yearFrom')}
                        className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="" disabled>Select year</option>
                        {Array.from({ length: 2050 - 2020 + 1 }, (_, i) => String(2050 - i)).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg bg-white text-emerald-900">
                        {toDisplay(savedProfile?.yearFrom ?? studentInfo.yearFrom)}
                      </div>
                    )}
                    {fieldErrors.yearFrom ? (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.yearFrom}</p>
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-800 mb-1">To</label>
                    {canEdit ? (
                      <select
                        value={studentInfo.yearTo}
                        onChange={setField('yearTo')}
                        className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="" disabled>Select year</option>
                        {Array.from({ length: 2050 - 2020 + 1 }, (_, i) => String(2050 - i)).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg bg-white text-emerald-900">
                        {toDisplay(savedProfile?.yearTo ?? studentInfo.yearTo)}
                      </div>
                    )}
                    {fieldErrors.yearTo ? (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.yearTo}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#C1E1C1]/75 rounded-none p-8 shadow-lg border-0">
            <h2 className="text-2xl font-bold text-emerald-800 mb-3">Personal information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Father Name</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={personalInfo.fatherName}
                    onChange={setPersonalField('fatherName')}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter father name"
                  />
                ) : (
                  <ValueBox value={savedProfile?.fatherName ?? personalInfo.fatherName} />
                )}
                {fieldErrors.fatherName ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.fatherName}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Father Phone Number</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={personalInfo.fatherPhoneNumber}
                    onChange={setPersonalField('fatherPhoneNumber')}
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter father phone number"
                  />
                ) : (
                  <ValueBox value={savedProfile?.fatherPhoneNumber ?? personalInfo.fatherPhoneNumber} />
                )}
                {fieldErrors.fatherPhoneNumber ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.fatherPhoneNumber}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Mother Name</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={personalInfo.motherName}
                    onChange={setPersonalField('motherName')}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter mother name"
                  />
                ) : (
                  <ValueBox value={savedProfile?.motherName ?? personalInfo.motherName} />
                )}
                {fieldErrors.motherName ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.motherName}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Mother Phone Number</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={personalInfo.motherPhoneNumber}
                    onChange={setPersonalField('motherPhoneNumber')}
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter mother phone number"
                  />
                ) : (
                  <ValueBox value={savedProfile?.motherPhoneNumber ?? personalInfo.motherPhoneNumber} />
                )}
                {fieldErrors.motherPhoneNumber ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.motherPhoneNumber}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Aadhaar Number</label>
                {canEdit ? (
                  <textarea
                    rows={1}
                    value={personalInfo.aadhaarNumber}
                    onChange={setPersonalField('aadhaarNumber')}
                    inputMode="numeric"
                    maxLength={12}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter 12-digit Aadhaar"
                  />
                ) : (
                  <ValueBox value={savedProfile?.aadhaarNumber ?? personalInfo.aadhaarNumber} />
                )}
                {fieldErrors.aadhaarNumber ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.aadhaarNumber}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Blood Group</label>
                {canEdit ? (
                  <select
                    value={personalInfo.bloodGroup}
                    onChange={setPersonalField('bloodGroup')}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="" disabled>Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <ValueBox value={savedProfile?.bloodGroup ?? personalInfo.bloodGroup} />
                )}
                {fieldErrors.bloodGroup ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.bloodGroup}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Address</label>
                {canEdit ? (
                  <textarea
                    rows={5}
                    value={personalInfo.address}
                    onChange={setPersonalField('address')}
                    className="w-full resize-none px-4 py-3 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter address"
                  />
                ) : (
                  <ValueBox value={savedProfile?.address ?? personalInfo.address} />
                )}
                {fieldErrors.address ? (
                  <p className="text-xs text-red-600 mt-1">{fieldErrors.address}</p>
                ) : null}
              </div>
            </div>
          </div>

          {canEdit ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSaveInformation}
                disabled={saving}
                className="px-8 py-3 rounded-lg bg-[#2E8B57] text-white font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {saving ? 'Saving...' : (saveSuccess ? 'Saved successfully' : 'Save')}
              </button>
            </div>
          ) : null}

          {saveSuccess ? (
            <p className="text-center text-sm font-semibold text-emerald-800">{saveSuccess}</p>
          ) : null}
          {saveError ? (
            <p className="text-center text-sm font-semibold text-red-600">{saveError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
