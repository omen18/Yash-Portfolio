const path = require('path');
const fs = require('fs');

module.exports = function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'resume.pdf');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'resume.pdf not found. Add it to the public/ folder.' });
  }

  res.setHeader('Content-Disposition', 'attachment; filename="Yash_Raj_Sharan_Resume.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  return res.send(fs.readFileSync(filePath));
};
