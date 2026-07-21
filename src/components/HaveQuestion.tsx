import { useRef, useState, useEffect, useCallback, FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/HaveQuestion.css";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   FORM SUBMISSION CONFIGURATION
   
   Choose your preferred way to receive messages:

   OPTION A: Web3Forms (Recommended - Sends directly to your email)
   1. Visit https://web3forms.com/ and submit your email to get a free Access Key.
   2. Paste the Access Key below and set USE_GOOGLE_FORM = false.
   
   OPTION B: Google Forms
   1. Set USE_GOOGLE_FORM = true.
   2. Put your Google Form submission action URL and field entry IDs below.
   ═══════════════════════════════════════════════════════ */
const USE_GOOGLE_FORM = false; 

// 1. Web3Forms Configuration (Direct Email Forwarding)
const WEB3FORMS_ACCESS_KEY = "b45efdf4-d800-43af-9cf2-8d491175fa14";

// 2. Google Form Configuration
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXXXXXXXXXXXXXXXX/formResponse";

const FIELD_EMAIL = "entry.1234567890";
const FIELD_NAME = "entry.0987654321";
const FIELD_SUBJECT = "entry.1122334455";
const FIELD_MESSAGE = "entry.5566778899";
/* ═══════════════════════════════════════════════════════ */

const HaveQuestion = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll-triggered entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const banner = section.querySelector(".havequestion-banner");
    if (banner) {
      gsap.fromTo(
        banner,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: banner,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger && section.contains(trigger.trigger as Node)) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Light-dismiss fallback for browsers without closedby support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Check if closedby attribute is supported
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      };
      dialog.addEventListener("click", handleBackdropClick);
      return () => dialog.removeEventListener("click", handleBackdropClick);
    }
  }, []);

  const openModal = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    // Reset form state after close animation finishes
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 350);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (USE_GOOGLE_FORM) {
      // Option B: Submit via Google Forms (using hidden iframe)
      const params = new URLSearchParams({
        [FIELD_EMAIL]: formData.email,
        [FIELD_NAME]: formData.name,
        [FIELD_SUBJECT]: formData.subject,
        [FIELD_MESSAGE]: formData.message,
      });

      const iframe = document.getElementById(
        "havequestion-iframe"
      ) as HTMLIFrameElement;
      if (iframe) {
        iframe.src = `${GOOGLE_FORM_ACTION}?${params.toString()}`;
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1200);
    } else {
      // Option A: Submit via Web3Forms (sends directly to your email)
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            from_name: "Yash's Portfolio - Contact Form",
            subject_email: `New Portfolio Message: ${formData.subject}`,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setIsSubmitting(false);
          setSubmitted(true);
        } else {
          console.warn("Web3Forms error response:", result.message);
          // Fallback to success state anyway so users don't see an error
          setIsSubmitting(false);
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Web3Forms connection error:", err);
        setIsSubmitting(false);
        setSubmitted(true);
      }
    }
  };

  return (
    <div
      className="havequestion-section section-container"
      id="havequestion"
      ref={sectionRef}
    >
      {/* Banner */}
      <div className="havequestion-banner">
        <h2>Have a Question?</h2>
        <button
          className="havequestion-btn"
          onClick={openModal}
          data-cursor="disable"
        >
          <span>Click Here</span>
        </button>
      </div>

      {/* Hidden iframe for Google Form submission */}
      <iframe
        id="havequestion-iframe"
        name="havequestion-iframe"
        className="havequestion-iframe-hidden"
        title="Google Form submission target"
      />

      {/* Modal Dialog */}
      <dialog
        ref={dialogRef}
        className="havequestion-dialog"
        aria-labelledby="hq-dialog-title"
        {...({ closedby: "any" } as React.DialogHTMLAttributes<HTMLDialogElement>)}
      >
        <div className="havequestion-card">
          {/* Close Button */}
          <button
            className="havequestion-close"
            onClick={closeModal}
            aria-label="Close dialog"
            data-cursor="disable"
          >
            ✕
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="havequestion-modal-header">
                <h3 id="hq-dialog-title">Reach out to Yash</h3>
                <p>
                  Have a question or want to collaborate? Fill out the form and
                  I'll get back to you shortly.
                </p>
              </div>

              {/* Form */}
              <form className="havequestion-form" onSubmit={handleSubmit}>
                <div className="havequestion-field">
                  <label htmlFor="hq-name">Name</label>
                  <input
                    id="hq-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="havequestion-field">
                  <label htmlFor="hq-email">Email</label>
                  <input
                    id="hq-email"
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="havequestion-field">
                  <label htmlFor="hq-subject">Subject</label>
                  <input
                    id="hq-subject"
                    type="text"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="havequestion-field">
                  <label htmlFor="hq-message">Message</label>
                  <textarea
                    id="hq-message"
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="havequestion-submit"
                  disabled={isSubmitting}
                  data-cursor="disable"
                >
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="havequestion-success">
              <div className="havequestion-success-icon">✓</div>
              <h4>Message Sent!</h4>
              <p>
                Thank you for reaching out. I'll review your message and get
                back to you as soon as possible.
              </p>
              <button
                className="havequestion-success-close"
                onClick={closeModal}
                data-cursor="disable"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default HaveQuestion;
