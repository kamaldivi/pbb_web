import forge from 'node-forge';
import fs from 'fs';

// Generate a key pair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

const attrs = [{
  name: 'commonName',
  value: 'localhost'
}];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.sign(keys.privateKey);

// Convert to PEM format
const pemKey = forge.pki.privateKeyToPem(keys.privateKey);
const pemCert = forge.pki.certificateToPem(cert);

// Write to files
fs.writeFileSync('localhost-key.pem', pemKey);
fs.writeFileSync('localhost-cert.pem', pemCert);

console.log('✅ SSL certificates generated successfully!');
console.log('📄 localhost-key.pem');
console.log('📄 localhost-cert.pem');