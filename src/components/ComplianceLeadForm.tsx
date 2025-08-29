"use client";

import React, { useState } from 'react';
import GlowingInput from '@/components/ui/GlowingInput';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
// Utility function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Custom Checkbox Component
interface Option {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

interface CustomCheckboxProps {
  option: Option;
  checked: boolean;
  onChange: (option: Option, checked: boolean) => void;
  disabled?: boolean;
}

function CustomCheckbox({ option, checked, onChange, disabled = false }: CustomCheckboxProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "relative flex items-center space-x-3 p-4 rounded-2xl transition-colors duration-200 cursor-pointer group",
        checked 
          ? "bg-white/15" 
          : "bg-white/10 hover:bg-white/15",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => !disabled && onChange(option, !checked)}
    >
      <div className="relative">
        <div
          className={cn(
            "w-5 h-5 rounded-md transition-colors duration-200 flex items-center justify-center",
            checked ? "bg-white/70" : "bg-white/20"
          )}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-3 h-3 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <span className={cn(
          "text-sm font-medium transition-colors duration-200",
          checked ? "text-white" : "text-neutral-300 group-hover:text-neutral-200"
        )}>
          {option.label}
        </span>
      </div>
    </motion.div>
  );
}

// MultipleCheckboxSelector Component
interface MultipleCheckboxSelectorProps {
  value?: Option[];
  options?: Option[];
  onChange?: (options: Option[]) => void;
  disabled?: boolean;
  className?: string;
}

function MultipleCheckboxSelector({
  value = [],
  options = [],
  onChange,
  disabled = false,
  className,
}: MultipleCheckboxSelectorProps) {
  const [selected, setSelected] = useState<Option[]>(value);

  const handleToggle = (option: Option, checked: boolean) => {
    let newSelected: Option[];
    
    if (checked) {
      newSelected = [...selected, option];
    } else {
      newSelected = selected.filter(item => item.value !== option.value);
    }
    
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const isChecked = (option: Option) => {
    return selected.some(item => item.value === option.value);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {options.map((option) => (
        <CustomCheckbox
          key={option.value}
          option={option}
          checked={isChecked(option)}
          onChange={handleToggle}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// Main Component
interface ComplianceFormProps {
  title?: string;
  description?: string;
  calendarLink?: string;
}

export function ComplianceLeadForm({
  title = "Your Shortcut to Compliance",
  description = "Expert-guided, cost-effective, and ready in days—not months.",
  calendarLink = "https://cal.com/nivathan/30min"
}: ComplianceFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    workEmail: '',
    complianceStandards: [] as Option[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const clickAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const [emailError, setEmailError] = useState<string>('');

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const isCorporateEmail = (email: string) => {
    if (!isValidEmail(email)) return false;
    const domain = email.split('@')[1]?.toLowerCase() || '';
    const personalDomains = new Set([
      'gmail.com','googlemail.com','yahoo.com','yahoo.co.in','hotmail.com','outlook.com','live.com','msn.com','aol.com','icloud.com','me.com','mac.com','proton.me','protonmail.com','pm.me','gmx.com','gmx.de','mail.com','yandex.com','yandex.ru','zoho.com','fastmail.com','hey.com','inbox.com','rediffmail.com'
    ]);
    const academicSuffixes = ['.edu', '.ac.uk', '.ac.in', '.edu.au', '.edu.in'];
    if (personalDomains.has(domain)) return false;
    if (academicSuffixes.some(s => domain.endsWith(s))) return false;
    return true;
  };

  const complianceOptions: Option[] = [
    { value: 'soc2', label: 'SOC 2' },
    { value: 'gdpr', label: 'GDPR' },
    { value: 'hipaa', label: 'HIPAA' },
    { value: 'iso27001', label: 'ISO 27001' },
    { value: 'pcidss', label: 'PCI DSS' },
    { value: 'iso42001', label: 'ISO 42001' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCorporateEmail(formData.workEmail)) {
      setEmailError('Please enter a valid work email');
      return;
    }
    setIsSubmitting(true);
    try { clickAudioRef.current?.currentTime && (clickAudioRef.current.currentTime = 0); clickAudioRef.current?.play().catch(() => {}); } catch {}
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    // Redirect to calendar link after submit
    window.location.href = calendarLink;
  };

  const isFormValid = formData.firstName && 
                     formData.lastName && 
                     formData.companyName && 
                     isCorporateEmail(formData.workEmail) && 
                     formData.complianceStandards.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(120%_120%_at_30%_10%,#0f0f10_0%,#0b0b0c_60%,#000_100%)]">
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-semibold text-white mb-6"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-neutral-300 max-w-xl mx-auto"
            >
              {description}
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card className="relative z-10 mx-auto w-full max-w-2xl overflow-visible rounded-[28px] border-0 bg-[radial-gradient(120%_120%_at_30%_10%,#1a1a1a_0%,#0f0f10_60%,#0b0b0c_100%)] text-white shadow-2xl">
              <CardContent className="p-4 sm:p-5">
                <audio ref={clickAudioRef} src="/computer-mouse-click-352734.mp3" preload="auto" />
                <form onSubmit={handleSubmit} className="space-y-4 relative pb-12">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block mb-1.5 text-xs font-medium text-neutral-300/80">
                        First Name *
                      </label>
                      <GlowingInput
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block mb-1.5 text-xs font-medium text-neutral-300/80">
                        Last Name *
                      </label>
                      <GlowingInput
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="block mb-1.5 text-xs font-medium text-neutral-300/80">
                      Company Name *
                    </label>
                    <GlowingInput
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>

                  {/* Work Email */}
                  <div className="space-y-2">
                    <label htmlFor="workEmail" className="block mb-1.5 text-xs font-medium text-neutral-300/80">
                      Work Email *
                    </label>
                    <GlowingInput
                      id="workEmail"
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({ ...prev, workEmail: val }));
                        setEmailError(val.length === 0 || isCorporateEmail(val) ? '' : 'Please enter a valid work email (no personal providers)');
                      }}
                      placeholder="Enter your work email"
                    />
                    {emailError && (
                      <p className="text-xs text-red-400 mt-1">{emailError}</p>
                    )}
                  </div>

                  {/* Compliance Standards */}
                  <div>
                    <div>
                      <label className="block mb-1.5 text-xs font-medium text-neutral-300/80">
                      Select all compliance standards you need guidance on *
                      </label>
                    </div>
                    <MultipleCheckboxSelector
                      value={formData.complianceStandards}
                      options={complianceOptions}
                      onChange={(options) => setFormData(prev => ({ ...prev, complianceStandards: options }))}
                    />
                  </div>

                  {/* Submit as bottom lime bar like profile-card */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={cn(
                      "absolute left-0 right-0 -bottom-2 mx-auto w-full rounded-[16px] h-12",
                      "flex items-center justify-center gap-2 text-black font-semibold",
                      "bg-lime-500 hover:bg-lime-400 transition-colors",
                      "shadow-[0_40px_80px_-16px_rgba(163,230,53,0.8)]",
                      !isFormValid || isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <Zap className="h-4 w-4" />
                    {isSubmitting ? 'Submitting…' : 'Schedule a Call'}
                  </button>

                  {/* Calendar section removed; submission triggers redirect */}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ComplianceLeadFormDemo() {
  return (
    <ComplianceLeadForm
      title="Your Shortcut to Compliance"
      description="Expert-guided, cost-effective, and ready in days—not months."
      calendarLink="https://cal.com/nivathan/30min"
    />
  );
}


