export default function PrivacyPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 50%, #fcfbf8 100%)',
      color: '#282828',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '800', 
            color: '#282828',
            marginBottom: '16px'
          }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            InstaSimple Analytics - Last updated: August 4, 2025
          </p>
        </header>

        <div style={{
          background: 'rgba(252, 251, 248, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid rgba(199, 154, 66, 0.2)',
          lineHeight: '1.8'
        }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Information We Collect
            </h2>
            <p style={{ marginBottom: '16px' }}>
              We collect the following information when you use our service:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>Google account information (for authentication)</li>
              <li>Instagram public profile information</li>
              <li>Instagram post insights and analytics data</li>
              <li>Service usage analytics</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              How We Use Information
            </h2>
            <p style={{ marginBottom: '16px' }}>
              We use the collected information for the following purposes:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>Provide Instagram analytics reports</li>
              <li>Improve and optimize our service</li>
              <li>Provide customer support</li>
              <li>Prevent violations of our terms of service</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Information Sharing and Disclosure
            </h2>
            <p style={{ marginBottom: '16px' }}>
              We do not share your personal information with third parties except:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>When required by law or legal process</li>
              <li>To protect our rights, property, or safety</li>
              <li>With your explicit consent</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your data against unauthorized access, 
              alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Data Retention
            </h2>
            <p>
              We retain your information only as long as necessary to provide our services or as required by law. 
              You can request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Your Rights
            </h2>
            <p style={{ marginBottom: '16px' }}>
              You have the following rights regarding your personal information:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>Access: Request access to your personal data</li>
              <li>Correction: Request correction of inaccurate data</li>
              <li>Deletion: Request deletion of your data</li>
              <li>Portability: Request transfer of your data</li>
              <li>Withdrawal: Withdraw consent for data processing</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Instagram Data Usage
            </h2>
            <p>
              This application uses Instagram Basic Display API to access your Instagram content. 
              We only access public data and insights that you explicitly grant permission for. 
              You can revoke access at any time through your Instagram account settings.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#c79a42' }}>
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:<br />
              Email: info@thorsync.com<br />
              Address: Japan
            </p>
          </section>

          <footer style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(199, 154, 66, 0.2)' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Last updated: August 4, 2025
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}