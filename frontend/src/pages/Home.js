// frontend/src/pages/Home.js
import React from 'react';
import LeadCaptureForm from '../components/Forms/LeadCaptureForm.jsx';
import AccordionItem from '../components/FAQ/AccordionItem.js';

// Icons
import insightsIcon from '../assets/images/insights-icon.svg';
import guidanceIcon from '../assets/images/guidance-icon.svg';
import confidentialIcon from '../assets/images/confidential-icon.svg';
import toolsIcon from '../assets/images/tools-icon.svg';

const Home = () => {
  return (
    <main id="main-content" role="main">
      {/* Hero Section (Dark) - Form removed */}
      <section
        className="section dark-section hero"
        aria-labelledby="hero-heading"
      >
        <div className="container text-center">
          <h1 id="hero-heading">Take Control of Your Financial Future</h1>
          <p>
            Get personalised financial insights and recommendations tailored to your goals.
            Start your free assessment now.
          </p>
          <a href="#assessment-form" className="btn btn-primary brand-link-button">
            Start Your Free Assessment
          </a>
        </div>
      </section>

      {/* How It Works Section (Dark) */}
      <section
        id="how-it-works"
        className="section dark-section"
        aria-labelledby="how-it-works-heading"
      >
        <div className="container">
          <h2 id="how-it-works-heading">How It Works</h2>
          <div className="steps">
            <article>
              <h3>1. Provide Your Details</h3>
              <p>Share basic information about your current financial situation to get started.</p>
            </article>
            <article>
              <h3>2. Get Your Personalised Report</h3>
              <p>
                Receive a customised financial health score and tailored recommendations within seconds.
              </p>
            </article>
            <article>
              <h3>3. Implement & Improve</h3>
              <p>
                Access expert guidance, tools, and resources to continuously improve your financial well-being.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Key Features Section (Light) with Intro + Card Layout */}
      <section
        id="features"
        className="section light-section"
        aria-labelledby="features-heading"
      >
        <div className="container">
          <h2 id="features-heading">Key Features</h2>

          {/* Intro paragraph to give context */}
          <div className="feature-intro">
            <p>
            Discover how our comprehensive Financial Health Check empowers you to take control of your financial future. Our professional-grade assessment tools deliver actionable insights tailored to your unique situation.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <img
                src={insightsIcon}
                alt="Insights Icon"
                style={{ width: '50px', marginBottom: '8px' }}
              />
              <h3>In-Depth Insights</h3>
              <p>Gain deep visibility into your financial behaviors with sophisticated metrics that evaluate your spending patterns, saving capabilities, and investment strategies.</p>
            </article>

            <article className="feature-card">
              <img
                src={guidanceIcon}
                alt="Guidance Icon"
                style={{ width: '50px', marginBottom: '8px' }}
              />
              <h3>Expert Guidance</h3>
              <p>Receive clear, actionable strategies aligned with your specific goals and circumstances. Transform insights into meaningful progress with step-by-step guidance.</p>
            </article>

            <article className="feature-card">
              <img
                src={confidentialIcon}
                alt="Confidential Icon"
                style={{ width: '50px', marginBottom: '8px' }}
              />
              <h3>Secure & Confidential</h3>
              <p>Rest assured knowing your sensitive information is protected. We maintain the highest standards of data privacy and confidentiality throughout your assessment.</p>
            </article>

            <article className="feature-card">
              <img
                src={toolsIcon}
                alt="Tools Icon"
                style={{ width: '50px', marginBottom: '8px' }}
              />
              <h3>Interactive Tools</h3>
              <p>Our advanced analytical tools help you explore different scenarios and track your progress with precision. Make informed decisions with clear, real-time visual feedback.</p>
            </article>
          </div>
        </div>
      </section>

            {/* Score Breakdown Section (Light) */}
      <section
        id="score-breakdown"
        className="section light-section score-breakdown-section"
        aria-labelledby="score-breakdown-heading"
      >
        <div className="container">
          <h2 id="score-breakdown-heading">Understand Your Financial Scores</h2>
          <p>
            Our assessment generates multiple scores to provide a comprehensive snapshot of your financial health. Here's what each score means:
          </p>
          <div className="score-grid">
            <article className="score-card">
              <h3>Debt-to-Income Score</h3>
              <p>
              Measures the relationship between your monthly debt obligations and income. A higher score indicates a healthier debt balance, offering greater financial flexibility and borrowing capacity.
              </p>
            </article>
            <article className="score-card">
              <h3>Savings Score</h3>
              <p>
              Evaluates your liquid assets as a percentage of annual income, measured against age-based benchmarks. A higher score indicates strong saving habits that align with or exceed recommended guidelines.
              </p>
            </article>
            <article className="score-card">
              <h3>Emergency Fund Score</h3>
              <p>
              Assesses your financial resilience by comparing available emergency funds against six months of essential expenses. A higher score demonstrates stronger preparation for unexpected financial circumstances.
              </p>
            </article>
            <article className="score-card">
              <h3>Retirement Score</h3>
              <p>
              Evaluates retirement preparedness by analysing current savings trajectory against projected retirement needs. A higher score indicates better alignment with long-term retirement objectives.
              </p>
            </article>
            <article className="score-card">
              <h3>Growth Opportunity Score</h3>
              <p>
              Measures the variance between current investment allocation and recommended age-based investment targets. A lower score indicates closer alignment with optimal investment strategies.
              </p>
            </article>
            <article className="score-card">
              <h3>Overall Financial Health Score</h3>
              <p>
              Synthesises performance across all financial metrics (with adjusted Growth Opportunity weighting) to provide a comprehensive wellness assessment. A higher score reflects stronger overall financial health.
              </p>
            </article>
            <article className="score-card">
              <h3>Potential for Improvement Score</h3>
              <p>
                Represents the differential between your current financial health and optimal financial wellness benchmarks. A higher score indicates greater opportunities for strengthening your financial position through targeted improvements.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Dark) */}
      <section
        id="testimonials"
        className="section dark-section testimonials"
        aria-labelledby="testimonials-heading"
      >
        <div className="container text-center">
          <h2 id="testimonials-heading">What Our Users Say</h2>
              <blockquote>
                <p>
                  "This tool helped me understand where I stand financially.
                  I've already made changes that saved me thousands!"
                </p>
                <footer>– Alex T., Entrepreneur</footer>
              </blockquote>
              <blockquote>
                <p>
                  "The personalised recommendations were spot-on. I feel more confident about my future."
                </p>
                <footer>– Maria S., Marketing Manager</footer>
              </blockquote>
              <blockquote>
                <p>
                  "Easy to use and incredibly insightful. I highly recommend it to anyone looking to get serious about their finances."
                </p>
                <footer>– David K., Freelancer</footer>
              </blockquote>
        </div>
      </section>

      {/* Assessment Form Section (NEW) */}
      <section
        id="assessment-form"
        className="section dark-section assessment-form-section"
        aria-labelledby="assessment-form-heading"
      >
        <div className="container text-center">
          <h2 id="assessment-form-heading">Start Your Financial Health Check</h2>
          <p>
            Fill out the form below to receive your personalised financial analysis and recommendations.
          </p>
          <LeadCaptureForm />
        </div>
      </section>

      {/* FAQ Section (Light) */}
      <section
        id="faq"
        className="section light-section faq-section"
        aria-labelledby="faq-heading"
      >
        <div className="container">
          <h2 id="faq-heading">Frequently Asked Questions</h2>

          {/* Wrap all accordion items in a unified container */}
          <div className="faq-accordion">
            <AccordionItem
              question="Is this service really free?"
              answer="Yes. Your initial financial assessment and insights are at no cost."
            />
            <AccordionItem
              question="Will my information remain private?"
              answer="Absolutely. We never share your personal data without consent."
            />
            <AccordionItem
              question="How long does it take to get my results?"
              answer="Just a few seconds. Once you submit your details, we'll generate a personalised report quickly."
            />
            <AccordionItem
              question="Can I talk to a financial advisor directly?"
              answer="Yes. We offer optional consultations with a licensed expert for more in-depth guidance."
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;