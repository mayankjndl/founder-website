/**
 * form.js — Contact Form Module
 * Piyush Jadhav Personal Brand Website
 *
 * PHASE 4 IMPLEMENTATION
 * Handles:
 *  - Client-side validation
 *  - Async fetch to /api/submit-lead
 *  - Loading states on the submit button
 *  - Success/error message rendering inside `#form-status`
 *  - Form reset on success
 */

'use strict';

const FORM_ID     = 'contact-form';
const ENDPOINT    = '/api/submit-lead';
const STATUS_ID   = 'form-status';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Please enter your full name.' });
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters.' });
  }

  return { valid: errors.length === 0, errors };
}

function showStatus(message, isSuccess = true) {
  const statusEl = document.getElementById(STATUS_ID);
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = 'form-status-message'; // Reset classes
  statusEl.classList.add(isSuccess ? 'is-success' : 'is-error');
  
  // Auto-hide after 5 seconds if success
  if (isSuccess) {
    setTimeout(() => {
      statusEl.className = 'form-status-message';
      statusEl.textContent = '';
    }, 5000);
  }
}

async function submitForm(data, submitBtn) {
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Submission failed');
    }

    showStatus("Message received! I'll get back to you within 24 hours.", true);
    document.getElementById(FORM_ID)?.reset();

  } catch (err) {
    showStatus('Something went wrong. Please try again or email me directly.', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function initContactForm() {
  const form = document.getElementById(FORM_ID);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous UI states
    form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach((el) => {
      el.classList.remove('is-error');
    });
    const statusEl = document.getElementById(STATUS_ID);
    if (statusEl) {
      statusEl.className = 'form-status-message';
      statusEl.textContent = '';
    }

    // Collect Data
    const formData = new FormData(form);
    const data = {
      name:     formData.get('name')?.trim() || '',
      company:  formData.get('company')?.trim() || '',
      email:    formData.get('email')?.trim() || '',
      phone:    formData.get('phone')?.trim() || '',
      interest: formData.get('interest')?.trim() || '',
      budget:   formData.get('budget')?.trim() || '',
      message:  formData.get('message')?.trim() || '',
      _hp_name: formData.get('_hp_name')?.trim() || '', // Honeypot field
    };

    // Client-side validation
    const { valid, errors } = validateForm(data);

    if (!valid) {
      errors.forEach(({ field }) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) input.classList.add('is-error');
      });
      showStatus('Please fix the errors in the highlighted fields.', false);
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    await submitForm(data, submitBtn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});
