import React, { useState, useEffect } from "react";

const Screen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedStrength, setSelectedStrength] = useState(null);
  const [selectedPacking, setSelectedPacking] = useState(null);
  const [showMoreForms, setShowMoreForms] = useState(false);
  const [showMoreStrengths, setShowMoreStrengths] = useState(false);
  const [showMorePackings, setShowMorePackings] = useState(false);

  const pharmacyIds = "1,2,3"; // Assuming these are your pharmacy IDs

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        const response = await fetch(
          `backend.cappsule.co.in/api/v1/new_search?q=<span class="math-inline">\{searchTerm\}&pharmacyIds\=</span>{pharmacyIds}`
        );
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults(null);
      }
    };

    fetchData();
  }, [searchTerm]); // Refetch data on search term change

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Implement search logic here (may involve additional filtering based on selections)
  };

  const handleFormSelection = (form) => {
    setSelectedForm(form.id);
    setSelectedStrength(null);
    setSelectedPacking(null);
    setShowMoreStrengths(false);
    setShowMorePackings(false);
  };

  const handleStrengthSelection = (strength) => {
    setSelectedStrength(strength.id);
    setSelectedPacking(null);
    setShowMorePackings(false);
  };

  const handlePackingSelection = (packing) => {
    setSelectedPacking(packing.id);
  };

  const handleShowMore = (type) => {
    switch (type) {
      case "form":
        setShowMoreForms(!showMoreForms);
        break;
      case "strength":
        setShowMoreStrengths(!showMoreStrengths);
        break;
      case "packing":
        setShowMorePackings(!showMorePackings);
        break;
      default:
        break;
    }
  };

  const renderSearchResults = () => {
    if (!searchResults) {
      return <div>Loading...</div>;
    }

    const { forms, ...rest } = searchResults; // Destructure forms from searchResults
    let filteredResults = rest; // Placeholder for filtering based on selections

    // Implement filtering logic here based on selectedForm, selectedStrength, and selectedPacking
    // You can use techniques like array filtering and mapping
    if (selectedForm) {
      filteredResults = filteredResults.filter(
        (item) => item.formId === selectedForm
      );
    }

    if (selectedStrength) {
      filteredResults = filteredResults.filter(
        (item) => item.strengthId === selectedStrength
      );
    }

    if (selectedPacking) {
      filteredResults = filteredResults.filter(
        (item) => item.packingId === selectedPacking
      );
    }

    return (
      <div>
        {/* Display filtered results here */}
        {filteredResults.length === 0 ? (
          <div>No stores selling this product near you</div>
        ) : (
          filteredResults.map((item) => (
            <div key={item.id}>
              {/* Display details of each item, including lowest price */}
              <p>Form: {item.form.name}</p>
              <p>Strength: {item.strength.name}</p>
              <p>Packing: {item.packing.name}</p>
              <p>Price: {item.lowestPrice}</p>
              {/* Additional product details can be displayed here */}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderSelectionButtons = (type, data, selectedId) => {
    return (
      <div>
        <span>{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
        {data.length > 2 && (
          <button onClick={() => handleShowMore(type)}>
            {showMoreForms ? "Hide" : "More"}
          </button>
        )}
        {data.slice(0, showMoreForms ? data.length : 2).map((item) => (
          <button
            key={item.id}
            className={selectedId === item.id ? "selected" : ""}
            onClick={() => handleSelectionFunctions(type, item)} // Replace with actual selection function call
          >
            {item.name}
          </button>
        ))}
      </div>
    );
  };

  // Return statement for the main component
  return (
    <div className='search-screen'>
      {/* Search bar */}
      <input
        type='text'
        placeholder='Search for salt'
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Selection buttons */}
      {searchResults && (
        <div className='selections'>
          {/* Form selection */}
          {renderSelectionButtons("form", selectedForm)}
          {/* Strength selection */}
          {renderSelectionButtons("strength", selectedStrength)} // Replace
          "strengths" with actual data
          {/* Packing selection */}
          {renderSelectionButtons("packing", selectedPacking)} // Replace
          "packings" with actual data
        </div>
      )}

      {/* Search results */}
      {renderSearchResults()}
    </div>
  );
};

export default Screen;
