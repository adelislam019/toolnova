import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, Shield, Globe, Cpu, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Button } from '../components/Button';
import { getPopularTools } from '../data/toolsConfig';

export const AboutPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'About ToolNova', path: '/about' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <SEOHead
        title="About ToolNova — Privacy-First Online Tools"
        description="Learn how ToolNova delivers high-speed, 100% browser-based online tools for images, PDFs, OCR, and developer workflows without collecting user files."
        path="/about"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        About ToolNova
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed mb-10">
        ToolNova is a fast, free, and privacy-focused online tools suite engineered for users in the
        United States, United Kingdom, Canada, Australia, and Europe who require reliable everyday
        utilities without compromising their private files or data.
      </p>

      <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-blue-600" />
            Our Architectural Mission: Privacy by Execution
          </h2>
          <p className="mb-4">
            Legacy online converters force you to upload sensitive contracts, client photos, and
            business spreadsheets to opaque third-party servers. Even if those services claim to
            delete your files within an hour, the file has already traversed the public internet and
            sat on an unknown hard drive.
          </p>
          <p>
            ToolNova flips this paradigm: our tools are designed from the ground up to execute
            inside your browser using modern WebAssembly, Canvas 2D, and ECMAScript APIs. Your files
            stay inside your local device memory and never transit to a backend server.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-blue-600" />
            Engineered for Modern Web Standards
          </h2>
          <p className="mb-4">
            We use proven client-side technologies such as <code>pdf-lib</code> for PDF generation,
            assembly-optimized codecs for image transformations, and standard cryptographic
            algorithms for encoding and decoding. This eliminates file upload lag and server queue
            bottlenecks.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-blue-600" />
            No Paywalls, No Registration, No Watermarks
          </h2>
          <p>
            Every single utility on ToolNova is unrestricted: no forced credit cards, no email
            traps, and zero branding watermarks added to your outputs. We believe everyday utility
            tools should simply work without friction.
          </p>
        </section>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Tool Request');
  const [message, setMessage] = useState('');

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <SEOHead
        title="Contact Us — ToolNova Support & Feedback"
        description="Have a suggestion for a new tool or need assistance? Reach out to the ToolNova engineering and product team."
        path="/contact"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        Get in Touch
      </h1>
      <p className="text-base text-slate-600 mb-8">
        Have feedback, found an issue, or want to request a new tool? We’d love to hear from you.
      </p>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-emerald-900">Message Received</h2>
          <p className="text-sm text-emerald-800 max-w-md mx-auto">
            Thank you for contacting ToolNova. Your feedback has been recorded and our team reviews
            user requests regularly.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setMessage('');
            }}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject
            </label>
            <select
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="Feature / New Tool Request">Feature / New Tool Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you'd like to see added or improved..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
            Submit Feedback
          </Button>
        </form>
      )}
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <SEOHead
        title="Privacy Policy — ToolNova Privacy Standards"
        description="Read the ToolNova Privacy Policy. We do not store, view, or retain your files, which remain on your computer at all times."
        path="/privacy-policy"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        Privacy Policy
      </h1>
      <p className="text-xs font-mono text-slate-500 mb-8">Effective Date: October 4, 2026</p>

      <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-6">
        <p>
          At ToolNova, user privacy is our foundational operating principle. This Privacy Policy
          explains how data is handled when you use the ToolNova web platform.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Local Client-Side Execution</h2>
        <p>
          ToolNova’s core utilities (including HEIC to JPG, WebP conversion, Image Compressor,
          Image Resizer, PDF Merge &amp; Split, EXIF Remover, QR Generator, Favicon Generator, and
          JSON Formatter) execute entirely inside your web browser’s memory using client-side
          technologies.
        </p>
        <p>
          <strong>Your files are never transmitted to, processed on, or stored on our servers.</strong>
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Zero Account Requirement</h2>
        <p>
          We do not require user registration, usernames, email addresses, or phone numbers to use
          any of our basic utilities.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. Cookies &amp; Tracking</h2>
        <p>
          ToolNova does not utilize intrusive third-party cross-site advertising cookies or sell user
          browsing behaviors. Local settings (such as quality sliders or tool preferences) may be
          kept in your browser’s temporary state and cleared whenever you refresh the page.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">4. Contact Information</h2>
        <p>
          If you have questions regarding this Privacy Policy, please contact us via our Contact page.
        </p>
      </div>
    </div>
  );
};

export const TermsOfServicePage: React.FC = () => {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Terms of Service', path: '/terms-of-service' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <SEOHead
        title="Terms of Service — ToolNova"
        description="ToolNova Terms of Service for individuals and businesses using our free online conversion and utility tools."
        path="/terms-of-service"
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        Terms of Service
      </h1>
      <p className="text-xs font-mono text-slate-500 mb-8">Effective Date: October 4, 2026</p>

      <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-6">
        <p>
          Welcome to ToolNova. By accessing or using our website, you agree to comply with and be
          bound by these Terms of Service.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">1. Permitted Use</h2>
        <p>
          ToolNova provides free utilities for personal, educational, and commercial purposes. You
          may process your own images, PDFs, code payloads, and marketing campaign URLs without fee.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">2. Prohibited Conduct</h2>
        <p>
          You agree not to attempt to reverse engineer, disrupt, overload, or maliciously compromise
          the integrity of the ToolNova web application or its underlying distribution infrastructure.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-6">3. Disclaimer of Warranties</h2>
        <p>
          ToolNova is provided &ldquo;as is&rdquo; without warranties of any kind. While we strive for
          flawless file handling, always keep backups of critical documents prior to conversion or
          compression.
        </p>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const popular = getPopularTools();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <SEOHead
        title="404 — Page Not Found | ToolNova"
        description="The page or tool you are looking for does not exist on ToolNova."
        path="/404"
      />

      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
        404
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-base text-slate-600 mb-8 max-w-md mx-auto">
        Sorry, the page you were looking for doesn&rsquo;t exist, has been removed, or had its address
        changed.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
        <Link
          to="/all-tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          Explore All Tools
        </Link>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Popular Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {popular.map((t) => (
            <Link
              key={t.slug}
              to={t.route}
              className="text-blue-600 hover:text-blue-800 hover:underline py-1"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
