/**
 * Interactive Cost Calculator Component for Jupiter Air HVAC Blog
 * Features: Real-time calculations, form validation, accessibility
 */
import React, { useState, useEffect, useCallback } from 'react';

interface CostFactor {
  id: string;
  label: string;
  type: 'select' | 'range' | 'checkbox';
  options?: { value: string; label: string; multiplier: number }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
  multiplier?: number;
  description?: string;
}

interface CostCalculatorProps {
  title: string;
  basePrice: number;
  factors: CostFactor[];
  resultRange?: [number, number];
  className?: string;
  disclaimer?: string;
}

const CostCalculator: React.FC<CostCalculatorProps> = ({
  title,
  basePrice,
  factors,
  resultRange,
  className = '',
  disclaimer
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [estimatedCost, setEstimatedCost] = useState<[number, number]>([0, 0]);
  const [isCalculated, setIsCalculated] = useState(false);

  // Initialize default values
  useEffect(() => {
    const defaultValues: Record<string, any> = {};
    factors.forEach(factor => {
      if (factor.defaultValue !== undefined) {
        defaultValues[factor.id] = factor.defaultValue;
      } else if (factor.type === 'select' && factor.options?.[0]) {
        defaultValues[factor.id] = factor.options[0].value;
      } else if (factor.type === 'range' && factor.min !== undefined) {
        defaultValues[factor.id] = factor.min;
      } else if (factor.type === 'checkbox') {
        defaultValues[factor.id] = false;
      }
    });
    setValues(defaultValues);
  }, [factors]);

  // Calculate cost estimate
  const calculateCost = useCallback(() => {
    let multiplier = 1;
    let additionalCosts = 0;

    factors.forEach(factor => {
      const value = values[factor.id];
      
      if (factor.type === 'select' && factor.options) {
        const selectedOption = factor.options.find(opt => opt.value === value);
        if (selectedOption) {
          multiplier *= selectedOption.multiplier;
        }
      } else if (factor.type === 'range' && factor.multiplier) {
        const rangeMultiplier = 1 + ((value - (factor.min || 0)) / ((factor.max || 1) - (factor.min || 0))) * (factor.multiplier - 1);
        multiplier *= rangeMultiplier;
      } else if (factor.type === 'checkbox' && value && factor.multiplier) {
        additionalCosts += basePrice * (factor.multiplier - 1);
      }
    });

    const baseCost = basePrice * multiplier + additionalCosts;
    const lowEstimate = Math.round(baseCost * 0.85);
    const highEstimate = Math.round(baseCost * 1.15);

    setEstimatedCost([lowEstimate, highEstimate]);
    setIsCalculated(true);

    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cost_calculation', {
        event_category: 'engagement',
        event_label: title,
        value: Math.round((lowEstimate + highEstimate) / 2)
      });
    }
  }, [values, factors, basePrice, title]);

  // Update value handler
  const updateValue = (factorId: string, newValue: any) => {
    setValues(prev => ({
      ...prev,
      [factorId]: newValue
    }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`cost-calculator bg-white border border-gray-200 rounded-xl p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {title}
        </h3>
        <p className="text-gray-600 text-sm">
          Get an instant estimate based on your specific needs. Results are approximate and may vary.
        </p>
      </div>

      {/* Form Factors */}
      <div className="space-y-4 mb-6">
        {factors.map(factor => (
          <div key={factor.id} className="form-group">
            <label 
              htmlFor={factor.id}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {factor.label}
              {factor.description && (
                <span className="block text-xs text-gray-500 font-normal">
                  {factor.description}
                </span>
              )}
            </label>

            {factor.type === 'select' && factor.options && (
              <select
                id={factor.id}
                value={values[factor.id] || ''}
                onChange={(e) => updateValue(factor.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {factor.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {factor.type === 'range' && (
              <div className="range-input">
                <input
                  id={factor.id}
                  type="range"
                  min={factor.min}
                  max={factor.max}
                  step={factor.step || 1}
                  value={values[factor.id] || factor.min}
                  onChange={(e) => updateValue(factor.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{factor.min}</span>
                  <span className="font-medium text-blue-600">{values[factor.id] || factor.min}</span>
                  <span>{factor.max}</span>
                </div>
              </div>
            )}

            {factor.type === 'checkbox' && (
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  id={factor.id}
                  type="checkbox"
                  checked={values[factor.id] || false}
                  onChange={(e) => updateValue(factor.id, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include this option</span>
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateCost}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Calculate Estimate
      </button>

      {/* Results */}
      {isCalculated && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Estimated Cost Range</h4>
          <div className="text-2xl font-bold text-blue-700 mb-2">
            {formatCurrency(estimatedCost[0])} - {formatCurrency(estimatedCost[1])}
          </div>
          <p className="text-sm text-blue-700">
            * This is an estimate based on typical pricing. Actual costs may vary based on specific conditions, accessibility, and current market rates.
          </p>
          
          {/* CTA */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <a
              href="/contact"
              className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Get Exact Quote
            </a>
            <a
              href="tel:9403905676"
              className="flex-1 border border-blue-600 text-blue-600 text-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              Call for Details
            </a>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Disclaimer:</strong> {disclaimer}
          </p>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>Licensed & Insured</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>Free Estimates</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <span>Satisfaction Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;