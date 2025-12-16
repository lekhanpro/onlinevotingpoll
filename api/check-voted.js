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

    const { voterId } = req.query;

    if (!voterId) {
        return res.status(400).json({
            success: false,
            message: 'Voter ID is required'
        });
    }

    const voter = data.findVoter(voterId);

    if (!voter) {
        return res.status(404).json({
            success: false,
            message: 'Voter not found'
        });
    }

    res.json({
        success: true,
        hasVoted: voter.hasVoted
    });
};
