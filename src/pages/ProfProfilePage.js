import ProfHeaderNav from '../components/ProfHeaderNav';
import Footer from '../components/Footer';
import React from 'react';

export default function ProfProfilePage() {
  const [studentPhotoFile, setStudentPhotoFile] = React.useState(null);
  const [studentPhotoPreviewUrl, setStudentPhotoPreviewUrl] = React.useState('');
  const [studentInfo, setStudentInfo] = React.useState({
    firstName: '',
    secondName: '',
    phoneNumber: '',
    subjects: '',
    domain: ''
  });

  React.useEffect(() => {
    if (!studentPhotoFile) {
      setStudentPhotoPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(studentPhotoFile);
    setStudentPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [studentPhotoFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setStudentPhotoFile(file);
  };

  return (
    <>
      <ProfHeaderNav />
      <div className="max-w-5xl mx-auto py-8 px-2 md:px-8">
        <div className="bg-white rounded-2xl shadow p-8 border border-gray-200">
          <h1 className="text-3xl font-bold mb-8">
            <span style={{ color: '#0F172A' }}>Professor </span>
            <span style={{ color: '#0F9D78' }}>Information</span>
          </h1>
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="photo-upload" className="flex flex-col items-center justify-center border-2 rounded-xl h-36 w-36 cursor-pointer mb-2" style={{ borderColor: '#0F9D78', borderStyle: 'solid' }}>
              {studentPhotoPreviewUrl ? (
                <img src={studentPhotoPreviewUrl} alt="Profile Preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <span className="text-lg" style={{ color: '#0F9D78' }}>Add Photo</span>
              )}
              <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <div className="text-emerald-700 text-sm mt-1">JPG/PNG/WEBP • Max 2MB</div>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block mb-1 font-medium text-emerald-800">First Name</label>
              <input name="firstName" value={studentInfo.firstName} onChange={handleInputChange} placeholder="Enter first name" className="w-full border rounded-lg p-3 text-gray-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-emerald-800">Second Name</label>
              <input name="secondName" value={studentInfo.secondName} onChange={handleInputChange} placeholder="Enter second name" className="w-full border rounded-lg p-3 text-gray-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-emerald-800">Phone Number</label>
              <input name="phoneNumber" value={studentInfo.phoneNumber} onChange={handleInputChange} placeholder="Enter phone number" className="w-full border rounded-lg p-3 text-gray-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-emerald-800">Domain</label>
                <input name="domain" value={studentInfo.domain} onChange={handleInputChange} placeholder="Enter domain" className="w-full border rounded-lg p-3 text-gray-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-emerald-800">Subjects</label>
                <input name="subjects" value={studentInfo.subjects} onChange={handleInputChange} placeholder="Enter subjects" className="w-full border rounded-lg p-3 text-gray-500 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
