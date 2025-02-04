"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';

export default function CreatePatientPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const evacSpecialty = ["Gaza - Medical Evacuations"];
  const allSpecialties = [
    "Cardiology",
    "Dentistry & OMFS",
    "Dermatology & Wound Care",
    "Plastics & Burn Care",
    "Infectious Disease",
    "Internal Medicine & Hospitalist",
    "Family Medicine & Urgent Care",
    "Emergency Medicine & Trauma",
    "Endocrinology",
    "Hematology",
    "Gastroenterology",
    "Geriatrics",
    "Hospice & Palliative Care",
    "Mental Health - Social Work",
    "Mental Health - Clinical Psychology",
    "Mental Health - Cognitive & Behavioral",
    "Mental Health - Child Psychology",
    "Mental Health - Psychotherapy",
    "Mental Health - Religious, Cultural, Emotional & Social Support Counseling",
    "Nephrology",
    "Neurology",
    "OB/GYN & Maternal Fetal Medicine",
    "OB/GYN - Midwife / Lactation Consultants",
    "Oncology",
    "Ophthalmology & Optometry",
    "Orthopedic & Trauma Surgery",
    "ENT, Head & Neck",
    "Pediatrics - General Medicine",
    "Pediatrics - Neurology",
    "Pediatrics - GI",
    "Pediatrics - Cardiology",
    "Pediatric - Oncology & Endocrinology",
    "Neonatal & Fetal Medicine",
    "Physical Medicine and Rehabilitation",
    "Physical & Occupational Therapy",
    "Pulmonology & Respiratory",
    "Psychiatry - Adult",
    "Psychiatry - Child & Adolescent",
    "Radiology",
    "Rheumatology",
    "Surgery - General",
    "Surgery - Vascular",
    "Surgery - Cardiothoracic",
    "Surgery - Neuro",
    "Urology",
  ];

 
  const specialtyOptions = session?.user?.accountType === "Evac" ? evacSpecialty : allSpecialties;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    language: "English",
    chiefComplaint: "",
    city: "",
    phone: "",
    country: "",
    priority: "Routine",
    specialty: specialtyOptions[0], // Set default specialty based on user type
    status: "Not Started",
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/patient", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to create patient.");
      }

      router.push("/patient-dashboard");
    } catch (err) {
      console.error("Error creating patient:", err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6" style={{ paddingTop: "4rem" }}>
      <h1 className="text-2xl font-bold mb-4">Create New Patient</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="border rounded p-2 w-full"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="border rounded p-2 w-full"
        />
        <input
          name="dob"
          value={form.dob}
          onChange={handleChange}
          placeholder="Date of Birth (YYYY-MM-DD)"
          type="date"
          required
          className="border rounded p-2 w-full"
        />
        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          <option value="English">English</option>
          <option value="Arabic">Arabic</option>
          <option value="Farsi">Farsi</option>
          <option value="Pashto">Pashto</option>
        </select>
        <textarea
          name="chiefComplaint"
          value={form.chiefComplaint}
          onChange={handleChange}
          placeholder="Chief Complaint"
          required
          className="border rounded p-2 w-full"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="border rounded p-2 w-full"
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="border rounded p-2 w-full"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone (e.g., +1234567890)"
          type="tel"
          pattern="^\+?[1-9]\d{1,14}$"
          required
          className="border rounded p-2 w-full"
        />
        <select
          name="specialty"
          value={form.specialty}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          {specialtyOptions.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          <option value="Routine">Routine</option>
          <option value="Moderate">Moderate</option>
          <option value="Urgent">Urgent</option>
          <option value="Emergency">Emergency</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Patient
        </button>
      </form>
    </div>
  );
}
