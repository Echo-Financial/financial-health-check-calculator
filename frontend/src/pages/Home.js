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
      {/* Hero Section (Dark) */}
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
          <LeadCaptureForm />
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
                Receive a customised financial health score and tailored recommendations within minutes.
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
              Below are some of the key benefits you'll gain from our Financial Health Check. Each feature is designed to empower you with valuable insights and guidance on your financial journey.
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
              <p>Understand your spending, saving, and investment habits.</p>
            </article>

            <article className="feature-card">
              <img
                src={guidanceIcon}
                alt="Guidance Icon"
                style={{ width: '50px', marginBottom: '8px' }}
              />
              <h3>Expert Guidance</h3>
              <p>Receive professional advice and action plans from licensed advisors.</p>
            </article>

            <article className="feature-card">
              <img
                src={confidentialIcon}
                alt="Confidential Icon"
                style={{ width: '50px', marginBottom: '8px' }}
              />
              <h3>Secure & Confidential</h3>
              <p>We use advanced encryption to keep your data safe and private.</p>
            </article>

            <article className="feature-card">
              <img
                src={toolsIcon}
                alt="Tools Icon"
                style={{ width: '50px', marginBottom: '8px' }}
              />
              <h3>Interactive Tools</h3>
              <p>Visualize your progress with charts, gauges, and scenario analyses.</p>
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
          <ul className="testimonial-list">
            <li>
              <blockquote>
                <p>
                  "This tool helped me understand where I stand financially. 
                  I’ve already made changes that saved me thousands!"
                </p>
                <footer>– Alex T., Entrepreneur</footer>
              </blockquote>
            </li>
            <li>
              <blockquote>
                <p>
                  "The personalized recommendations were spot-on. I feel more confident about my future."
                </p>
                <footer>– Maria S., Marketing Manager</footer>
              </blockquote>
            </li>
            <li>
              <blockquote>
                <p>
                  "Easy to use and incredibly insightful. I highly recommend it to anyone looking to get serious about their finances."
                </p>
                <footer>– David K., Freelancer</footer>
              </blockquote>
            </li>
          </ul>
          <a href="#hero-heading" className="btn btn-secondary">
            Start Your Free Assessment
          </a>
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
              answer="Just a few seconds. Once you submit your details, we’ll generate a personalised report quickly."
            />
            <AccordionItem
              question="Can I talk to a financial advisor directly?"
              answer="Yes. We offer optional consultations with licensed experts for more in-depth guidance."
            />
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
            Our assessment generates multiple scores to provide a comprehensive snapshot of your financial health. Here’s what each score means:
          </p>
          <div className="score-grid">
            <article className="score-card">
              <h3>Debt-to-Income Score</h3>
              <p>
                Indicates how well you manage debt relative to your income. A higher score means you carry less debt compared to your earnings, providing more financial flexibility.
              </p>
            </article>
            <article className="score-card">
              <h3>Savings Score</h3>
              <p>
                Reflects the percentage of your annual income saved in liquid assets against an age-adjusted target. A higher score shows you’re saving at or above the recommended rate.
              </p>
            </article>
            <article className="score-card">
              <h3>Emergency Fund Score</h3>
              <p>
                Measures whether your emergency funds cover approximately six months of living expenses. A higher score means you’re better prepared to handle unexpected financial challenges.
              </p>
            </article>
            <article className="score-card">
              <h3>Retirement Score</h3>
              <p>
                Assesses your retirement readiness by projecting your current savings forward compared to your target. A higher score indicates you’re on track for a secure retirement.
              </p>
            </article>
            <article className="score-card">
              <h3>Growth Opportunity Score</h3>
              <p>
                Evaluates the gap between your current investments and a dynamic, age-appropriate target. In this metric, a lower score is ideal; a higher score reveals greater room for improvement.
              </p>
            </article>
            <article className="score-card">
              <h3>Overall Financial Health Score</h3>
              <p>
                Provides a high-level snapshot by averaging your performance across key areas (with the Growth Opportunity Score inverted). A higher overall score signifies a healthier financial position.
              </p>
            </article>
            <article className="score-card">
              <h3>Potential for Improvement Score</h3>
              <p>
                Indicates how much room you have to enhance your financial health. Calculated as 100 minus your Overall Score, a higher number means there is significant opportunity to improve.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Additional CTA Section (Dark) */}
      <section
        className="section dark-section cta-section"
        aria-labelledby="cta-heading"
      >
        <div className="container text-center">
          <h2 id="cta-heading">Ready to Secure Your Financial Future?</h2>
          <p>
            Join thousands of satisfied users who have taken the first step toward financial security.
          </p>
          <a href="#hero-heading" className="btn btn-primary">
            Get Started Now
          </a>
        </div>
      </section>
    </main>
  );
};

export default Home;
