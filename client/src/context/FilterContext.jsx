import { createContext, useState } from 'react'

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        electronics: false,
        household: false,
        fashion: false,
        beauty: false,
        accessories: false,
        priceRange: [0, 100000],
    });

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    )
}