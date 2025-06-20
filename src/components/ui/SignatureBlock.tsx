import React from 'react';

export const SignatureBlock: React.FC<{ party1?: string, party2?: string, party1Role?: string, party2Role?: string }> = ({ party1, party2, party1Role = 'Party 1', party2Role = 'Party 2' }) => (
  <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>SIGNATURES</h3>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ width: '45%', minWidth: 250 }}>
        <p><strong>{party1Role}:</strong></p>
        <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8 }}></div>
        <p>By: {party1 || '____________________'}</p>
        <p>Name: ____________________</p>
        <p>Title: _____________________</p>
        <p>Date: _____________________</p>
      </div>
      <div style={{ width: '45%', minWidth: 250 }}>
        <p><strong>{party2Role}:</strong></p>
        <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8 }}></div>
        <p>By: {party2 || '____________________'}</p>
        <p>Name: ____________________</p>
        <p>Title: _____________________</p>
        <p>Date: _____________________</p>
      </div>
    </div>
  </div>
);

export const SinglePartySignatureBlock: React.FC<{ party?: string, partyRole?: string }> = ({ party, partyRole = 'Authorized Representative' }) => (
    <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>SIGNATURE</h3>
        <div style={{ width: '45%', minWidth: 250 }}>
            <p><strong>{partyRole}:</strong></p>
            <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8 }}></div>
            <p>By: {party || '____________________'}</p>
            <p>Name: ____________________</p>
            <p>Title: _____________________</p>
            <p>Date: _____________________</p>
        </div>
    </div>
);

export const PoASignatureBlock: React.FC<{ principal?: string, agent?: string, witness1?: string, witness2?: string, effectiveDate?: string }> = ({ principal, agent, witness1, witness2, effectiveDate }) => (
    <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
        <p>IN WITNESS WHEREOF, the Principal has executed this Power of Attorney on {effectiveDate || '[Date]'}.</p>
        <div style={{ marginTop: 32 }}>
            <p><strong>Principal:</strong></p>
            <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8 }}></div>
            <p>By: {principal || '[Principal\'s Name]'}</p>
            <p>Date: _____________________</p>
        </div>
        <div style={{ marginTop: 32 }}>
            <p><strong>Agent's Acceptance:</strong></p>
            <p>I, {agent || '[Agent\'s Name]'}, acknowledge and accept the appointment as Agent.</p>
            <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8, marginTop: 16 }}></div>
            <p>By: {agent || '[Agent\'s Name]'}</p>
            <p>Date: _____________________</p>
        </div>
        {(witness1 || witness2) && <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 32 }}>Witnesses</h3>}
        {witness1 && <div style={{ marginTop: 16 }}>
            <p><strong>Witness 1:</strong></p>
            <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8 }}></div>
            <p>Name: {witness1 || '[Witness 1 Name]'}</p>
            <p>Date: _____________________</p>
        </div>}
        {witness2 && <div style={{ marginTop: 16 }}>
            <p><strong>Witness 2:</strong></p>
            <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8 }}></div>
            <p>Name: {witness2 || '[Witness 2 Name]'}</p>
            <p>Date: _____________________</p>
        </div>}
         <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee', fontSize: 14, color: '#555' }}>
             <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Notary Acknowledgment</h3>
             <p>State of __________________)</p>
             <p>County of _________________)</p>
             <p style={{ marginTop: 16 }}>On this ____ day of ___________, 20__, before me, a Notary Public, personally appeared {principal || '[Principal\'s Name]'}, known to me to be the person whose name is subscribed to this instrument, and acknowledged that he/she executed the same.</p>
             <div style={{ height: 40, borderBottom: '1px solid #222', marginBottom: 8, marginTop: 32 }}></div>
             <p>Notary Public Signature</p>
             <p style={{ marginTop: 8 }}>My commission expires: _______________</p>
         </div>
    </div>
); 