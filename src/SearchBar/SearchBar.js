import React from "react";
const SearchBar = ({setSearch}) => {
    return(
            <div className="flex-container">
                <i className="bi bi-search flex-box wd-nudge-up"></i>
                <input placeholder="Search post, username, caption ..."
                       className="flex-box form-control rounded-pill" onChange={(e) =>
                    setSearch(e.target.value)} />

            </div>
    );
}

export default SearchBar;