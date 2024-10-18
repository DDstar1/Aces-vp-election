"use client";

import { useEffect, useState } from "react";
import BarChart from "@/components/BarChart"; // Import the BarChart component
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import { MoonLoader } from "react-spinners";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch data from Google Apps Script
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwn3mGJK3gY6q9QvBkCKeKhy1jKWyEPG7VDGKNPhBH3rJ7dcubwWLScUCr0EzMVF0-7nQ/exec?edit=false"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to update the validity field using API
  const updateValidity = async (email, newValidity) => {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwn3mGJK3gY6q9QvBkCKeKhy1jKWyEPG7VDGKNPhBH3rJ7dcubwWLScUCr0EzMVF0-7nQ/exec?edit=true&email=${email}&valid=${newValidity}`
      );
      const json = await response.json();
      console.log(json);

      const NEWresponse = await fetch(
        "https://script.google.com/macros/s/AKfycbwn3mGJK3gY6q9QvBkCKeKhy1jKWyEPG7VDGKNPhBH3rJ7dcubwWLScUCr0EzMVF0-7nQ/exec?edit=false"
      );

      const NEWjson = await NEWresponse.json();
      setData(NEWjson);
      toast({
        description:
          newValidity === "true"
            ? `${email} has been validated`
            : `${email} has been unvalidated`,
      });
    } catch (err) {
      console.error("Error updating validity", err);
      toast({
        variant: "destructive",
        description: "There was a problem with your request.",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <MoonLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Separate validated and unvalidated students
  const validatedStudents = data.filter((student) => student.Valid === true);
  const unvalidatedStudents = data.filter((student) => student.Valid === false);

  // Calculate totals
  const totalStudents = data.length;
  const totalValidated = validatedStudents.length;
  const totalUnvalidated = unvalidatedStudents.length;

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        {/* Fixed Navigation Bar */}

        {/* Total counts at the top */}
        <div id="totalCounts" className="mb-8 mt-16 text-center">
          <p>Total Students: {totalStudents}</p>
          <p>Validated Students: {totalValidated}</p>
          <p>Unvalidated Students: {totalUnvalidated}</p>
        </div>

        {/* Bar chart */}
        <div className="mb-10">
          <h2 id="barChart" className="text-2xl font-semibold mb-4">
            Votes Of Validated Students
          </h2>

          <BarChart data={validatedStudents} />
        </div>

        {/* Validated students table */}
        <h2 id="validatedStudents" className="text-2xl font-semibold mb-4">
          Validated Students
        </h2>

        {/* Responsive table for validated students */}
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full table-auto bg-white shadow-md rounded-2xl">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-600 uppercase md:text-xs text-sm leading-normal">
                <th className="sticky left-0 bg-gray-200 py-3 px-2">Num</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Matric Number</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2 w-10">Dept</th>
                <th className="py-3 px-2">Choice</th>
                <th className="py-3 px-2">Valid</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 md:text-xs text-sm font-light">
              {validatedStudents.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-100"
                >
                  <td className="sticky left-0 bg-gray-200 py-3 px-2 text-center">
                    {index + 1}
                  </td>
                  <td className="py-3 px-2">{student.Name}</td>
                  <td className="py-3 px-2">{student["Matric Number"]}</td>
                  <td className="py-3 px-2">{student["Email Address"]}</td>
                  <td className="py-3 px-2">{student.Department}</td>
                  <td className="py-3 px-2">
                    {student["Choose your Vice President"]}
                  </td>
                  <td className="py-3 px-2 text-green-500">True</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() =>
                        updateValidity(student["Email Address"], "false")
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                    >
                      Toggle Validity
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unvalidated students table */}
        <h2 id="unvalidatedStudents" className="text-2xl font-semibold mb-4">
          Unvalidated Students
        </h2>

        {/* Responsive table for unvalidated students */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-600 uppercase md:text-xs text-sm leading-normal">
                <th className="sticky left-0 bg-gray-200 py-3 px-2">Num</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Matric Number</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2 w-10">Dept</th>
                <th className="py-3 px-2">Choice</th>
                <th className="py-3 px-2">Valid</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 md:text-xs text-sm font-light">
              {unvalidatedStudents.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="sticky left-0 py-3 px-2 text-center bg-gray-200">
                    {index + 1}
                  </td>
                  <td className="py-3 px-2">{student.Name}</td>
                  <td className="py-3 px-2">{student["Matric Number"]}</td>
                  <td className="py-3 px-2">{student["Email Address"]}</td>
                  <td className="py-3 px-2">{student.Department}</td>
                  <td className="py-3 px-2">
                    {student["Choose your Vice President"]}
                  </td>
                  <td className="py-3 px-2 text-red-500">False</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() =>
                        updateValidity(student["Email Address"], "true")
                      }
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                    >
                      Toggle Validity
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Page;
