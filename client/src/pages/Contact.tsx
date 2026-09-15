import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Thank you! Your message has been sent to our support team.');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#11183D] pt-28 pb-20 font-sans selection:bg-[#4A8BDF]/20 selection:text-[#2459A8]">
      <Helmet>
        <title>Contact Us — R U Ready? Support & Enterprise Partnerships</title>
        <meta
          name="description"
          content="Get in touch with the R U Ready? support team for assistance with mock interviews, ATS scanner inquiries, university partnerships, or general feedback."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DCE7F2] text-[#4A8BDF] text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>We're Here to Help</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-[#11183D] tracking-tight"
          >
            Get in Touch with Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] leading-relaxed"
          >
            Have a question about interview sessions, ATS scoring, university bundles, or feedback? Send us a message and our engineering team will respond within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F2] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#11183D]">Support Channels</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2]">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2] shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#11183D]">Email Support</p>
                    <a href="mailto:support@ruready.app" className="text-xs text-[#4A8BDF] hover:underline font-mono">
                      support@ruready.app
                    </a>
                    <p className="text-[11px] text-[#7B8799] mt-0.5">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2]">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#A0006D] flex items-center justify-center border border-[#DCE7F2] shrink-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#11183D]">Operating Hours</p>
                    <p className="text-xs text-[#475569]">Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
                    <p className="text-[11px] text-[#7B8799] mt-0.5">AI mock session runners available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2]">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#168A62] flex items-center justify-center border border-[#DCE7F2] shrink-0">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#11183D]">Candidate Community</p>
                    <p className="text-xs text-[#475569]">Join peer discussions on roadmap topics</p>
                    <a href="/discuss" className="text-[11px] text-[#168A62] font-semibold hover:underline mt-0.5 inline-block">
                      Explore Open Role Communities →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#DCE7F2] shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5F0] text-[#168A62] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                <strong className="text-[#11183D]">Enterprise & Campus Inquiries:</strong> Looking to deploy R U Ready? across your university or boot camp? Reach out to <span className="text-[#4A8BDF] font-mono">partnerships@ruready.app</span>.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#DCE7F2] shadow-md">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 bg-[#E8F5F0] text-[#168A62] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#11183D]">Message Received!</h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                  Thank you for contacting R U Ready?. Our support team has received your inquiry and will follow up via email shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-semibold text-[#4A8BDF] hover:bg-[#4A8BDF] hover:text-white transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-[#11183D] mb-2">Send Us a Direct Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-sm text-[#11183D] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4A8BDF] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#334155]">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-sm text-[#11183D] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4A8BDF] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#334155]">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-sm text-[#11183D] focus:outline-none focus:border-[#4A8BDF] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical / Interview Room Issue</option>
                    <option value="ATS Scanner Question">ATS Resume Scanner Question</option>
                    <option value="Billing & Pricing">Billing & Pricing Bundles</option>
                    <option value="Enterprise & Campus">University & Enterprise Partnerships</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#334155]">Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we help you prepare and calibrate your interview readiness?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] text-sm text-[#11183D] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4A8BDF] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#11183D] hover:bg-[#1E293B] text-white font-semibold text-sm px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
