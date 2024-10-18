import React, { useEffect } from "react";
import { FaChartBar, FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa"; // Importing Font Awesome icons

function NavBar() {
  // Function to handle scrolling to the specified section with an offset
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Use scrollIntoView to scroll to the element
      element.scrollIntoView();

      // Adjust scroll position to account for the fixed navbar height
      window.scrollBy(0, -80); // Adjust based on your navbar height

      // Add the animation class
      element.classList.add("text-ani");

      // Remove the animation class after 2 seconds
      setTimeout(() => {
        element.classList.remove("text-ani");
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white py-2 z-50">
      <ul className="flex space-x-4 items-center justify-center md:justify-evenly">
        <li>
          <a
            onClick={() => scrollToSection("totalCounts")}
            className="flex gap-2 m-2 p-1 hover:border-b-2 border-white cursor-pointer"
          >
            <span className="md:hidden">Total Counts</span>
            <FaUsers size={30} />
          </a>
        </li>
        <li>
          <a
            onClick={() => scrollToSection("validatedStudents")}
            className="flex gap-2 m-2 p-1 hover:border-b-2 border-white cursor-pointer"
          >
            <span className="md:hidden">Validated Students</span>
            <FaUserCheck size={30} />
          </a>
        </li>
        <li>
          <a
            onClick={() => scrollToSection("unvalidatedStudents")}
            className=" flex gap-2 m-2 p-1 hover:border-b-2 border-white cursor-pointer"
          >
            <span className="md:hidden">Unvalidated Students</span>
            <FaUserTimes size={30} />
          </a>
        </li>
        <li>
          <a
            onClick={() => scrollToSection("barChart")}
            className=" flex gap-2 m-2 p-1 hover:border-b-2 border-white cursor-pointer"
          >
            <span className="md:hidden">Voting Chart</span>
            <FaChartBar size={30} />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
