# RNB Monorepo

## Overview

This monorepo contains the full backend, shared types, and supporting packages for the **Realms and Beyond (RNB)** platform. It is designed for scalability, strict typing, and clear separation of concerns between identity, accounts, billing, and domain-specific applications (e.g. NexusServe).

The architecture follows **domain-driven design**, **TypeScript-first modeling**, and **schema–type parity** between Mongoose schemas and shared `@rnb/types`.

---

## Monorepo Structure

```
/rnb
├── apps/
│   ├── aetherscribe/        # TTrpg content creation
│   ├── modularix-docs/     # Documentation page for @rnb/components
│   ├── nexus-serve/        # Employee management system
│   └── 
│
├── packages/
│   ├── modularix/          # @rnb/component library
│   ├── styles/             # scss global stylings & branding
│   └── types/              # Global @rnb/types for the entire repo
│
├── servers/                # Tooling & maintenance scripts
│   ├── nexus-serve-api/    # @rnb/nexus-serve/api backend for all employee & business management
│   ├── rnb-api/            # @rnb/api backend for all rnb data
├── package.json
├── tsconfig.base.json
└── README.md
```
to run an app, in the root folder of the app, run the command: pnpm dev
---

## Core Design Principles

* **Single Source of Truth for Types**
  All monorepo Types live in `@rnb/types`. Data must conform to these types.

* **Identity ≠ Account**
  A single identity can control multiple accounts.

* **Lifecycle-Aware Data**
  Soft deletes, recovery windows, and auditability are first-class.

---

## Domain Model Overview

### Identity

Represents a **real person**.

* Authentication credentials
* Personal profile
* Contact information
* Lifecycle state
* Links to accounts

# Advanced Form Component System

A highly modular, type-safe form system with support for multiple field types, validation, multi-step forms, and dropdown integration.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Field Types](#field-types)
- [Configuration System](#configuration-system)
- [Date Input](#date-input)
- [Dropdown Integration](#dropdown-integration)
- [Validation](#validation)
- [Multi-Step Forms](#multi-step-forms)
- [Examples](#examples)
- [API Reference](#api-reference)

## Features

✅ **Multiple Field Types**: text, email, password, number, dropdown, date, checkbox, radio, textarea  
✅ **Smart Date Input**: Day/Month/Year dropdowns with automatic validation  
✅ **Nested Dropdowns**: Support for hierarchical dropdown menus  
✅ **Type-Safe Configuration**: Full TypeScript support with generic types  
✅ **Flexible Validation**: Built-in and custom validation rules  
✅ **Multi-Step Support**: Built-in step navigation and progress tracking  
✅ **Modular Design**: Completely config-driven, no hardcoding  
✅ **Accessibility**: ARIA labels and semantic HTML  

## Quick Start

### Basic Form

```typescript
import { Form } from './Form'

const myFormConfig = {
    initialValue: {
        name: '',
        email: '',
    },
    fields: [
        {
            type: 'text' as const,
            fieldName: 'name' as const,
            label: 'Name',
            id: 'name',
            placeholder: 'Enter your name',
            required: true,
        },
        {
            type: 'email' as const,
            fieldName: 'email' as const,
            label: 'Email',
            id: 'email',
            placeholder: 'Enter your email',
            required: true,
        },
    ],
    buttonText: 'Submit',
    formTitle: 'Contact Form',
}

export const MyForm = () => {
    const handleSubmit = (data) => {
        console.log('Form submitted:', data)
    }

    return <Form config={myFormConfig} onSubmit={handleSubmit} />
}
```

## Field Types

### Text Field

```typescript
{
    type: 'text',
    fieldName: 'username',
    label: 'Username',
    id: 'username',
    placeholder: 'Choose a username',
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]+$',
}
```

### Email Field

```typescript
{
    type: 'email',
    fieldName: 'email',
    label: 'Email Address',
    id: 'email',
    placeholder: 'you@example.com',
    required: true,
}
```

### Password Field

```typescript
{
    type: 'password',
    fieldName: 'password',
    label: 'Password',
    id: 'password',
    placeholder: 'Enter password',
    required: true,
}
```

**Password Requirements (configurable):**
```typescript
passwordRequirements: {
    minLength: 9,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    specialCharPattern: '[!@#$%^&*(),.?":{}|<>]',
}
```

### Dropdown Field

```typescript
{
    type: 'dropdown',
    fieldName: 'country',
    label: 'Country',
    id: 'country',
    placeholder: 'Select your country',
    required: true,
    searchable: true,
    closeOnSelect: true,
    options: [
        { id: 'us', label: 'United States', value: 'US' },
        { id: 'uk', label: 'United Kingdom', value: 'UK' },
        { id: 'ca', label: 'Canada', value: 'CA' },
    ],
}
```

**Nested Dropdown:**
```typescript
{
    type: 'dropdown',
    fieldName: 'category',
    label: 'Category',
    id: 'category',
    openOnHover: true,
    options: [
        {
            id: 'electronics',
            label: 'Electronics',
            value: 'electronics',
            children: [
                { id: 'phones', label: 'Phones', value: 'phones' },
                { id: 'laptops', label: 'Laptops', value: 'laptops' },
            ],
        },
    ],
}
```

### Date Field

**The Ultimate Date Input Solution** 🎯

Instead of a text input with formatting issues, users select from validated dropdown menus:

```typescript
{
    type: 'date',
    fieldName: 'dateOfBirth',
    label: 'Date of Birth',
    id: 'dateOfBirth',
    required: true,
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    defaultYear: new Date().getFullYear() - 18, // Default to 18 years ago
    yearFirst: false, // false = DD/MM/YYYY, true = YYYY/MM/DD
}
```

**Features:**
- Three separate dropdowns: Day, Month, Year
- Automatic validation (e.g., no Feb 30th)
- Dynamic day count based on selected month/year (handles leap years)
- Searchable year dropdown for quick navigation
- Format control: `yearFirst: false` for DD/MM/YYYY or `true` for YYYY-MM-DD
- Default year for sensible starting position
- Min/max year constraints

**How it works:**
1. Year defaults to a sensible value (e.g., 18 years ago for age verification)
2. User selects from dropdown lists instead of typing
3. Day options automatically adjust based on month (28-31 days)
4. Leap years handled automatically
5. Final value combines into formatted string: `DD/MM/YYYY` or `YYYY-MM-DD`

### Checkbox Field

```typescript
{
    type: 'checkbox',
    fieldName: 'termsAccepted',
    label: 'Terms',
    id: 'termsAccepted',
    checkboxLabel: 'I agree to the Terms and Conditions',
    required: true,
}
```

### Radio Field

```typescript
{
    type: 'radio',
    fieldName: 'theme',
    label: 'Theme Preference',
    id: 'theme',
    required: true,
    options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'auto', label: 'Auto' },
    ],
}
```

### Textarea Field

```typescript
{
    type: 'textarea',
    fieldName: 'message',
    label: 'Message',
    id: 'message',
    placeholder: 'Enter your message...',
    rows: 8,
    required: true,
}
```

## Configuration System

### Complete Config Structure

```typescript
interface I_FormConfig<T> {
    // Initial form values
    initialValue: T

    // Field definitions
    fields: I_FieldConfig<T>[]

    // Form metadata
    buttonText: string
    formTitle: string
    
    // Optional features
    link?: I_Link
    linkText?: string
    errorMessage?: string | null
    passwordRequirements?: I_PasswordRequirements
    stepNavigation?: I_StepNavigation
    className?: string
    validateOnChange?: boolean
    showRequiredIndicator?: boolean
}
```

### Why Use Config-Based Forms?

**Traditional Approach (Hardcoded):**
```typescript
// ❌ Tightly coupled, hard to maintain
<form>
    <input type="text" name="firstName" />
    <input type="text" name="lastName" />
    <input type="email" name="email" />
    {/* Validation logic mixed in component */}
</form>
```

**Config-Based Approach:**
```typescript
// ✅ Reusable, testable, maintainable
const formConfig = {
    fields: [...],
    validation: {...},
}

<Form config={formConfig} onSubmit={handleSubmit} />
```

**Benefits:**
- ✅ **Separation of Concerns**: Data structure separate from UI
- ✅ **Reusability**: Same form, different data
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Testability**: Config can be tested independently
- ✅ **Maintainability**: Change config, not component code
- ✅ **Scalability**: Easy to add new field types

## Date Input

### Why Dropdowns Instead of Text Input?

**Traditional date input problems:**
- ❌ Format confusion (MM/DD vs DD/MM)
- ❌ Invalid dates (Feb 30, Apr 31)
- ❌ Manual typing errors
- ❌ Inconsistent formatting
- ❌ Poor mobile experience

**Dropdown solution:**
- ✅ No format confusion - select from lists
- ✅ Only valid dates available
- ✅ No typing errors
- ✅ Consistent output format
- ✅ Better mobile UX

### Date Configuration Options

```typescript
{
    type: 'date',
    fieldName: 'dateOfBirth',
    label: 'Date of Birth',
    id: 'dateOfBirth',
    
    // Year range
    minYear: 1900,
    maxYear: 2024,
    
    // Default starting position
    defaultYear: 2006, // Sensible for age 18+
    
    // Format control
    yearFirst: false, // DD/MM/YYYY (European)
    // yearFirst: true, // YYYY-MM-DD (ISO)
}
```

### Date Validation Example

```typescript
{
    type: 'date',
    fieldName: 'eventDate',
    label: 'Event Date',
    id: 'eventDate',
    validation: (value: string) => {
        if (!value) return null
        
        const parts = value.split('/')
        const day = parseInt(parts[0])
        const month = parseInt(parts[1])
        const year = parseInt(parts[2])
        
        const selectedDate = new Date(year, month - 1, day)
        const today = new Date()
        
        if (selectedDate < today) {
            return 'Date must be in the future'
        }
        
        return null
    },
}
```

## Dropdown Integration

The form seamlessly integrates with the existing Dropdown component.

### Simple Dropdown

```typescript
{
    type: 'dropdown',
    fieldName: 'size',
    label: 'Size',
    id: 'size',
    placeholder: 'Select size',
    options: [
        { id: 's', label: 'Small', value: 'S' },
        { id: 'm', label: 'Medium', value: 'M' },
        { id: 'l', label: 'Large', value: 'L' },
    ],
}
```

### Searchable Dropdown

```typescript
{
    type: 'dropdown',
    fieldName: 'country',
    label: 'Country',
    id: 'country',
    searchable: true, // Enable search
    options: [/* 100+ countries */],
}
```

### Nested Categories

```typescript
{
    type: 'dropdown',
    fieldName: 'category',
    label: 'Category',
    id: 'category',
    openOnHover: true,
    options: [
        {
            id: 'tech',
            label: 'Technology',
            children: [
                { id: 'software', label: 'Software', value: 'software' },
                { id: 'hardware', label: 'Hardware', value: 'hardware' },
            ],
        },
    ],
}
```

## Validation

### Built-In Validation

**Email:**
```typescript
{
    type: 'email', // Automatic email validation
    // ...
}
```

**Password:**
```typescript
// Configure requirements in form config
passwordRequirements: {
    minLength: 9,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: true,
}
```

**Text Length:**
```typescript
{
    type: 'text',
    minLength: 3,
    maxLength: 20,
    // ...
}
```

**Pattern Matching:**
```typescript
{
    type: 'text',
    pattern: '^[a-zA-Z0-9_]+$', // Only alphanumeric and underscore
    // ...
}
```

### Custom Validation

```typescript
{
    type: 'text',
    fieldName: 'age',
    label: 'Age',
    id: 'age',
    validation: (value: string) => {
        const age = parseInt(value)
        if (isNaN(age)) return 'Please enter a number'
        if (age < 18) return 'Must be 18 or older'
        if (age > 120) return 'Please enter a valid age'
        return null // No error
    },
}
```

### Cross-Field Validation

```typescript
{
    type: 'password',
    fieldName: 'passwordConfirm',
    label: 'Confirm Password',
    id: 'passwordConfirm',
    validation: (value: string, formValues?: any) => {
        if (value !== formValues?.password) {
            return 'Passwords do not match'
        }
        return null
    },
}
```

## Multi-Step Forms

### Step Configuration

```typescript
stepNavigation: {
    currentStep: 1,
    totalSteps: 3,
    onNext: () => setStep(step + 1),
    onBack: () => setStep(step - 1),
    showBackButton: true,
    showNextButton: true,
    nextButtonText: 'Continue',
    backButtonText: '← Back',
    completedSteps: [1], // Optional: track completed steps
}
```

### Multi-Step Example

```typescript
const [step, setStep] = useState(1)
const [formData, setFormData] = useState({})

const handleStepSubmit = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(step + 1)
}

return (
    <>
        {step === 1 && (
            <Form
                config={{
                    ...step1Config,
                    stepNavigation: {
                        currentStep: 1,
                        totalSteps: 3,
                    },
                }}
                onSubmit={handleStepSubmit}
            />
        )}
        {step === 2 && (
            <Form
                config={{
                    ...step2Config,
                    stepNavigation: {
                        currentStep: 2,
                        totalSteps: 3,
                        onBack: () => setStep(1),
                    },
                }}
                onSubmit={handleStepSubmit}
            />
        )}
    </>
)
```

## Examples

See `formUsageExamples.tsx` for complete working examples:

1. **Simple Registration Form** - Basic single-step form
2. **Multi-Step Job Application** - Three-step form with state management
3. **Login with Error Handling** - Dynamic error messages
4. **Custom Validation** - Complex validation rules
5. **Nested Dropdowns** - Hierarchical category selection
6. **User Preferences** - Radio buttons and checkboxes
7. **Event Registration** - Date validation for future dates
8. **Dynamic Forms** - Switch between different form configs
9. **Conditional Fields** - Show/hide fields based on values

## API Reference

### Form Component Props

```typescript
interface I_FormProps<T> {
    config: I_FormConfig<T>
    onSubmit: (value: T) => void
}
```

### Field Config Types

All field configs extend `I_BaseFieldConfig`:

```typescript
interface I_BaseFieldConfig<T> {
    fieldName: keyof T
    label: string
    id: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    className?: string
    validation?: (value: any, formValues?: T) => string | null
}
```

### Utility Functions

```typescript
// Generate year options for dropdowns
generateYearOptions(minYear?: number, maxYear?: number): I_DropdownOption[]

// Generate month options
generateMonthOptions(): I_DropdownOption[]

// Generate day options (adjusts for month/year)
generateDayOptions(month?: string, year?: string): I_DropdownOption[]

// Validate date components
isValidDate(day: string, month: string, year: string): boolean

// Calculate age from date components
calculateAge(day: string, month: string, year: string): number
```

## Best Practices

1. **Type Your Data**: Always create an interface for your form data
2. **Use Config Files**: Keep form configs in separate files
3. **Validate Early**: Use `validateOnChange: true` for better UX
4. **Default Values**: Always provide sensible defaults (especially for dates)
5. **Error Messages**: Make them specific and helpful
6. **Required Fields**: Mark them clearly with indicators
7. **Multi-Step**: Validate each step before allowing progression
8. **Accessibility**: Labels, ARIA attributes, and semantic HTML are built-in

## Styling

The form uses these CSS classes:

- `.form-wrapper` - Outer container
- `.form-contents` - Form element
- `.form-title` - Title heading
- `.form-input-wrapper` - Field container
- `.form-label` - Label element
- `.form-input` - Input element
- `.form-input.warning` - Error state
- `.error-wrapper` - Error message container
- `.error-text` - Error message text
- `.date-input-group` - Date dropdown container
- `.date-input` - Individual date dropdown
- `.required-indicator` - Required field asterisk

## Migration from Old Form

**Old approach:**
```typescript
<Form
    fields={[{
        fieldName: 'email',
        label: 'Email',
        id: 'email',
        inputType: 'email',
        placeholder: 'Enter email',
    }]}
    initialValue={{ email: '' }}
    onSubmit={handleSubmit}
    buttonText="Submit"
    formTitle="My Form"
/>
```

**New approach:**
```typescript
const config = {
    fields: [{
        type: 'email',
        fieldName: 'email',
        label: 'Email',
        id: 'email',
        placeholder: 'Enter email',
    }],
    initialValue: { email: '' },
    buttonText: "Submit",
    formTitle: "My Form",
}

<Form config={config} onSubmit={handleSubmit} />
```

## Support

For issues or questions, refer to:
- `Form.tsx` - Main component
- `formConfigs.ts` - Configuration examples
- `formUsageExamples.tsx` - Usage examples
> One Identity → many Accounts


