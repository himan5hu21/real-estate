import { useState, useRef, useEffect } from 'react';
import { HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi';

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  label = "",
  error = "",
  icon = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(option => option.value === value) || null
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setSelectedOption(options.find(option => option.value === value) || null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const highlightedElement = listRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        const currentIndex = options.findIndex(opt => opt.value === value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full flex items-center gap-3 px-4 py-3.5 
          bg-white border-2 rounded-xl 
          text-left transition-all duration-300
          ${disabled 
            ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' 
            : isOpen
              ? 'border-sky-500 ring-4 ring-sky-500/10 shadow-lg'
              : error
                ? 'border-red-300 hover:border-red-400'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Optional Icon */}
        {icon && (
          <span className="text-slate-400 flex-shrink-0">
            {icon}
          </span>
        )}

        {/* Selected Value */}
        <span className={`flex-1 truncate ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Chevron */}
        <HiOutlineChevronDown 
          className={`
            w-5 h-5 text-slate-400 flex-shrink-0 
            transition-transform duration-300
            ${isOpen ? 'rotate-180 text-sky-500' : ''}
          `}
        />
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div 
          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <ul 
            ref={listRef}
            className="max-h-60 overflow-auto py-2"
            role="listbox"
          >
            {options.map((option, index) => {
              const isSelected = selectedOption?.value === option.value;
              const isHighlighted = highlightedIndex === index;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    flex items-center justify-between gap-3 px-4 py-3
                    cursor-pointer transition-colors duration-150
                    ${isHighlighted ? 'bg-slate-50' : ''}
                    ${isSelected ? 'bg-sky-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Option Icon if available */}
                    {option.icon && (
                      <span className={isSelected ? 'text-sky-600' : 'text-slate-400'}>
                        {option.icon}
                      </span>
                    )}
                    <span className={`
                      font-medium
                      ${isSelected ? 'text-sky-700' : 'text-slate-700'}
                    `}>
                      {option.label}
                    </span>
                  </div>

                  {/* Check Icon for Selected */}
                  {isSelected && (
                    <HiOutlineCheck className="w-5 h-5 text-sky-600 flex-shrink-0" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Empty State */}
          {options.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">No options available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;