const data = require('./_data');

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const candidates = data.getCandidates();

    // Return candidates without vote counts (for security)
    const publicCandidates = candidates.map(c => ({
        id: c.id,
        name: c.name,
        party: c.party,
        symbol: c.symbol
    }));

    res.json({
        success: true,
        candidates: publicCandidates
    });
};
