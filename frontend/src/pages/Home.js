// frontend/src/pages/Home.js
import React from 'react';
import LeadCaptureForm from '../components/Forms/LeadCaptureForm.jsx';
import AccordionItem from '../components/FAQ/AccordionItem.js';

const Home = () => {
  return (
    <main id="main-content" role="main">
      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container text-center">
          <h1 id="hero-heading">Take Control of Your Financial Future</h1>
          <p>Get personalized financial insights and recommendations tailored to your goals. Start your free assessment now.</p>
          {/* Integrate your LeadCaptureForm here */}
          <LeadCaptureForm />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="info-section" aria-labelledby="how-it-works-heading">
        <div className="container">
          <h2 id="how-it-works-heading">How It Works</h2>
          <div className="steps">
            <article>
              <h3>1. Provide Your Details</h3>
              <p>Share basic information about your current financial situation to get started.</p>
            </article>
            <article>
              <h3>2. Get Your Personalized Report</h3>
              <p>Receive a customized financial health score and tailored recommendations within minutes.</p>
            </article>
            <article>
              <h3>3. Implement & Improve</h3>
              <p>Access expert guidance, tools, and resources to continuously improve your financial well-being.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="info-section alt-bg" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading">Key Features</h2>
          <div className="feature-grid">
            <article>
              <img src="/images/insights-icon.svg" alt="Insights Icon" width="50" height="50" />
              <h3>In-Depth Insights</h3>
              <p>Understand your spending, saving, and investment habits.</p>
            </article>
            <article>
              <img src="/images/guidance-icon.svg" alt="Guidance Icon" width="50" height="50" />
              <h3>Expert Guidance</h3>
              <p>Receive professional advice and action plans from licensed advisors.</p>
            </article>
            <article>
              <img src="/images/confidential-icon.svg" alt="Confidential Icon" width="50" height="50" />
              <h3>Secure & Confidential</h3>
              <p>We use advanced encryption to keep your data safe and private.</p>
            </article>
            <article>
              <img src="/images/tools-icon.svg" alt="Tools Icon" width="50" height="50" />
              <h3>Interactive Tools</h3>
              <p>Visualize your progress with charts, gauges, and scenario analyses.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials" aria-labelledby="testimonials-heading">
        <div className="container text-center">
          <h2 id="testimonials-heading">What Our Users Say</h2>
          <ul className="testimonial-list">
            <li>
              <blockquote>
                <p>"This tool helped me understand where I stand financially. I’ve already made changes that saved me thousands!"</p>
                <footer>– Alex T., Entrepreneur</footer>
              </blockquote>
            </li>
            <li>
              <blockquote>
                <p>"The personalized recommendations were spot-on. I feel more confident about my future."</p>
                <footer>– Maria S., Marketing Manager</footer>
              </blockquote>
            </li>
            <li>
              <blockquote>
                <p>"Easy to use and incredibly insightful. I highly recommend it to anyone looking to get serious about their finances."</p>
                <footer>– David K., Freelancer</footer>
              </blockquote>
            </li>
          </ul>
          <a href="#hero-heading" className="btn btn-secondary">Start Your Free Assessment</a>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section" aria-labelledby="faq-heading">
        <div className="container">
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <AccordionItem question="Is this service really free?" answer="Yes. Your initial financial assessment and insights are at no cost." />
          <AccordionItem question="Will my information remain private?" answer="Absolutely. We never share your personal data without consent." />
          <AccordionItem question="How long does it take to get my results?" answer="Just a few minutes. Once you submit your details, we’ll generate a personalized report quickly." />
          <AccordionItem question="Can I talk to a financial advisor directly?" answer="Yes. We offer optional consultations with licensed experts for more in-depth guidance." />
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container text-center">
          <h2 id="cta-heading">Ready to Secure Your Financial Future?</h2>
          <p>Join thousands of satisfied users who have taken the first step toward financial security.</p>
          <a href="#hero-heading" className="btn btn-primary">Get Started Now</a>
        </div>
      </section>
    </main>
  );
};

export default Home;
