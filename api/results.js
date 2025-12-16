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
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

    res.json({
        success: true,
        totalVotes,
        results: candidates.map(c => ({
            id: c.id,
            name: c.name,
            party: c.party,
            symbol: c.symbol,
            votes: c.votes,
            percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) : 0
        }))
    });
};
